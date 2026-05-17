import type { useWalletUiSigner } from '@wallet-ui/react'

import { getCreateV1Instruction, MPL_CORE_PROGRAM_ADDRESS } from '@obrera/mpl-core-kit-lib/generated'
import {
  type Address,
  appendTransactionMessageInstruction,
  assertIsTransactionMessageWithSingleSendingSigner,
  createTransactionMessage,
  generateKeyPairSigner,
  getBase58Decoder,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signAndSendTransactionMessageWithSigners,
} from '@solana/kit'

import type { SolanaClient } from '@/solana/data-access/solana-client'

export interface ProofMintInput {
  client: SolanaClient
  metadataUri: string
  name: string
  transactionSigner: ReturnType<typeof useWalletUiSigner>
}

export interface ProofMintResult {
  assetAddress: Address
  txSignature: string
}

export async function executeProofMint({ client, metadataUri, name, transactionSigner }: ProofMintInput) {
  const asset = await generateKeyPairSigner()
  const { value: latestBlockhash } = await client.rpc.getLatestBlockhash({ commitment: 'confirmed' }).send()
  const createInstruction = getCreateV1Instruction({
    asset,
    authority: transactionSigner,
    name,
    owner: transactionSigner.address,
    payer: transactionSigner,
    updateAuthority: transactionSigner.address,
    uri: metadataUri,
  })
  validatePublishedCreateInstruction(createInstruction)

  const message = pipe(
    createTransactionMessage({ version: 0 }),
    (transactionMessage) => setTransactionMessageFeePayerSigner(transactionSigner, transactionMessage),
    (transactionMessage) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, transactionMessage),
    (transactionMessage) => appendTransactionMessageInstruction(createInstruction, transactionMessage),
  )

  assertIsTransactionMessageWithSingleSendingSigner(message)

  const signatureBytes = await signAndSendTransactionMessageWithSigners(message)
  const txSignature = getBase58Decoder().decode(signatureBytes)

  return {
    assetAddress: asset.address,
    txSignature,
  } satisfies ProofMintResult
}

function validatePublishedCreateInstruction(instruction: ReturnType<typeof getCreateV1Instruction>) {
  if (instruction.programAddress !== MPL_CORE_PROGRAM_ADDRESS) {
    throw new Error(`Published package returned unexpected MPL Core program address: ${instruction.programAddress}`)
  }
  const accounts = instruction.accounts as readonly unknown[]
  const data = instruction.data ?? new Uint8Array()

  if (accounts.length === 0) {
    throw new Error(
      '@obrera/mpl-core-kit-lib generated getCreateV1Instruction has no account metas; package output is invalid and cannot create an MPL Core asset.',
    )
  }
  if (data.length <= 1) {
    throw new Error(
      '@obrera/mpl-core-kit-lib generated getCreateV1Instruction has insufficient instruction data; package output is invalid and cannot create an MPL Core asset.',
    )
  }
}
