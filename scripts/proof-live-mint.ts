import { getCreateV1Instruction } from '@obrera/mpl-core-kit-lib/generated'
import {
  appendTransactionMessageInstruction,
  createKeyPairSignerFromBytes,
  createSolanaRpc,
  createTransactionMessage,
  generateKeyPairSigner,
  getBase58Decoder,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signAndSendTransactionMessageWithSigners,
} from '@solana/kit'

const devnetHttp = 'https://api.devnet.solana.com'
const mplCoreProgramAddress = 'CoREENxT1ttXcRQA7jJZxGzDrJr3e9Fp3uL5X1YvCxy'

function base64ToBytes(value: string) {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

function formatError(error: unknown) {
  if (!(error instanceof Error)) {
    return String(error)
  }

  const details = [error.message]
  const logs = Reflect.get(error, 'logs')
  if (Array.isArray(logs)) {
    details.push(logs.join(' | '))
  }

  const cause = error.cause
  if (cause instanceof Error) {
    details.push(`cause: ${cause.message}`)
  }

  return details.join(' | ')
}

async function hashText(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function loadPayer() {
  const raw = process.env.POSTERPROOF_DEVNET_SIGNER_KEYPAIR
  if (!raw) {
    return generateKeyPairSigner()
  }

  const text = await readSignerInput(raw)
  const bytes = parseSignerBytes(text)
  return createKeyPairSignerFromBytes(bytes)
}

async function main() {
  let stage = 'startup'

  try {
    stage = 'connect devnet rpc'
    const rpc = createSolanaRpc(devnetHttp)

    stage = 'load payer'
    const payer = await loadPayer()
    const asset = await generateKeyPairSigner()

    if (process.env.POSTERPROOF_SKIP_AIRDROP !== '1') {
      throw new Error('Airdrop is intentionally disabled in the recovery proof script; provide a funded signer.')
    }

    stage = 'build mpl core create instruction'
    const packetHash = await hashText(`posterproof-live-${Date.now()}-${asset.address}`)
    const metadataUri = `https://posterproof087.colmena.dev/metadata/${packetHash}.json`
    const createInstruction = getCreateV1Instruction({
      asset,
      authority: payer,
      name: 'PosterProof Live Proof',
      owner: payer.address,
      payer,
      updateAuthority: payer.address,
      uri: metadataUri,
    })

    validatePublishedCreateInstruction(createInstruction)

    stage = 'fetch latest blockhash'
    const { value: latestBlockhash } = await rpc.getLatestBlockhash({ commitment: 'confirmed' }).send()
    const message = pipe(
      createTransactionMessage({ version: 0 }),
      (transactionMessage) => setTransactionMessageFeePayerSigner(payer, transactionMessage),
      (transactionMessage) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, transactionMessage),
      (transactionMessage) => appendTransactionMessageInstruction(createInstruction, transactionMessage),
    )

    stage = 'sign and send mpl core proof transaction'
    const signatureBytes = await signAndSendTransactionMessageWithSigners(message)
    const txSignature = getBase58Decoder().decode(signatureBytes)

    stage = 'verify mpl core asset account'
    const assetAccount = await rpc.getAccountInfo(asset.address, { commitment: 'confirmed', encoding: 'base64' }).send()
    if (!assetAccount.value) {
      throw new Error('MPL Core asset account was not found after confirmed transaction.')
    }

    console.log(
      JSON.stringify({
        assetAddress: asset.address,
        metadataUri,
        ok: true,
        payerAddress: payer.address,
        txSignature,
      }),
    )
  } catch (error) {
    console.log(
      JSON.stringify({
        blocker: formatError(error),
        ok: false,
        stage,
      }),
    )
  }
}

function parseSignerBytes(value: string) {
  const trimmed = value.trim()
  if (trimmed.startsWith('[')) {
    return new Uint8Array(JSON.parse(trimmed) as number[])
  }
  if (/^\d+(,\s*\d+)+$/.test(trimmed)) {
    return new Uint8Array(trimmed.split(',').map((part) => Number(part.trim())))
  }
  return base64ToBytes(trimmed)
}

async function readSignerInput(value: string) {
  const file = Bun.file(value)
  if (await file.exists()) {
    return file.text()
  }
  return value
}

function validatePublishedCreateInstruction(instruction: ReturnType<typeof getCreateV1Instruction>) {
  if (instruction.programAddress !== mplCoreProgramAddress) {
    throw new Error(`Published package returned unexpected MPL Core program address: ${instruction.programAddress}`)
  }
  if (!('accounts' in instruction) || instruction.accounts.length === 0) {
    throw new Error(
      '@obrera/mpl-core-kit-lib@0.0.2 generated getCreateV1Instruction has no account metas; published package is a placeholder and cannot create an MPL Core asset.',
    )
  }
  if (!('data' in instruction) || instruction.data.length <= 1) {
    throw new Error(
      '@obrera/mpl-core-kit-lib@0.0.2 generated getCreateV1Instruction has placeholder instruction data; published package cannot create an MPL Core asset.',
    )
  }
}

await main()
