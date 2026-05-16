import { useWalletUi } from '@wallet-ui/react'
import { Archive, FileCheck2, ScrollText } from 'lucide-react'
import { type ReactNode, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/core/ui/badge'
import { useProofMint } from '@/posterproof/data-access/use-proof-mint'
import { ShellUiLoader } from '@/shell/feature'
import { useSolanaClient } from '@/solana/data-access/use-solana-client'
import { useWalletSignMessage } from '@/wallet/data-access/use-wallet-sign-message'
import { getErrorMessage } from '@/wallet/ui/wallet-ui-error'

import { scanProofPacket } from '../data-access/originality-scanner'
import { defaultProofPacket, type ProofPacket } from '../data-access/proof-packet'
import { createMetadataUri, createReadinessMessage, saveProofRecord } from '../data-access/proof-record'
import { useProofHashQuery } from '../data-access/use-proof-hash-query'
import { useProofRecords } from '../data-access/use-proof-records'
import { PosterProofUiComposer } from '../ui/posterproof-ui-composer'
import { PosterProofUiOperator } from '../ui/posterproof-ui-operator'
import { PosterProofUiScan } from '../ui/posterproof-ui-scan'
import { PosterProofUiWalletStation } from '../ui/posterproof-ui-wallet-station'

export function Component() {
  return <PosterProofFeature />
}

export function PosterProofFeature() {
  const [packet, setPacket] = useState<ProofPacket>(defaultProofPacket)
  const [readinessSignature, setReadinessSignature] = useState('')
  const { account } = useWalletUi()
  const records = useProofRecords()
  const hashQuery = useProofHashQuery(packet)

  const scan = useMemo(() => {
    if (!hashQuery.data) {
      return undefined
    }
    return scanProofPacket(hashQuery.data.canonicalPacket, hashQuery.data.packetHash)
  }, [hashQuery.data])

  if (hashQuery.isLoading || !hashQuery.data || !scan) {
    return <ShellUiLoader fullScreen />
  }

  const metadataUri = createMetadataUri(hashQuery.data.packetHash)

  return (
    <div className="min-h-full bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.14),transparent_34%),linear-gradient(180deg,#09090b,#111113_40%,#09090b)]">
      <div className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="grid gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">Devnet MPL Core</Badge>
              <Badge variant="outline">IP provenance</Badge>
              <Badge variant="outline">Wallet-signed</Badge>
            </div>
            <h1 className="max-w-3xl text-3xl font-semibold tracking-normal text-white sm:text-5xl">PosterProof</h1>
            <p className="max-w-3xl text-sm leading-6 text-zinc-300 sm:text-base">
              Compose an artwork proof packet, hash deterministic canonical JSON, screen it against a reference
              registry, sign readiness, and mint a portable proof asset for timestamp and provenance inspection.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-lg border border-white/10 bg-black/25 p-2">
            <Metric
              icon={<ScrollText className="size-4" />}
              label="Packet hash"
              value={hashQuery.data.packetHash.slice(0, 10)}
            />
            <Metric icon={<FileCheck2 className="size-4" />} label="Readiness" value={`${scan.readinessScore}/100`} />
            <Metric icon={<Archive className="size-4" />} label="Proofs" value={records.length.toString()} />
          </div>
        </section>
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <PosterProofUiComposer
            canonicalJson={hashQuery.data.canonicalJson}
            packet={packet}
            packetHash={hashQuery.data.packetHash}
            setPacket={(nextPacket) => {
              setReadinessSignature('')
              setPacket(nextPacket)
            }}
          />
          <div className="grid content-start gap-4">
            <PosterProofUiScan scan={scan} />
            {account ? (
              <PosterProofConnectedStation
                account={account}
                canonicalJson={hashQuery.data.canonicalJson}
                metadataUri={metadataUri}
                packetHash={hashQuery.data.packetHash}
                packetTitle={hashQuery.data.canonicalPacket.title}
                readinessSignature={readinessSignature}
                scan={scan}
                setReadinessSignature={setReadinessSignature}
              />
            ) : (
              <PosterProofUiWalletStation
                canMint={false}
                isMinting={false}
                isSigning={false}
                onMint={() => undefined}
                onSign={() => undefined}
                readinessSignature=""
              />
            )}
          </div>
        </section>
        <PosterProofUiOperator
          canonicalJson={hashQuery.data.canonicalJson}
          packetHash={hashQuery.data.packetHash}
          records={records}
        />
      </div>
    </div>
  )
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md bg-white/[0.04] p-3">
      <div className="mb-2 text-emerald-200">{icon}</div>
      <div className="truncate text-[0.68rem] text-muted-foreground">{label}</div>
      <div className="truncate font-mono text-sm text-white">{value}</div>
    </div>
  )
}

function PosterProofConnectedStation({
  account,
  canonicalJson,
  metadataUri,
  packetHash,
  packetTitle,
  readinessSignature,
  scan,
  setReadinessSignature,
}: {
  account: NonNullable<ReturnType<typeof useWalletUi>['account']>
  canonicalJson: string
  metadataUri: string
  packetHash: string
  packetTitle: string
  readinessSignature: string
  scan: ReturnType<typeof scanProofPacket>
  setReadinessSignature: (signature: string) => void
}) {
  const client = useSolanaClient()
  const { isLoading: isSigning, signMessage } = useWalletSignMessage({ account })
  const { isMinting, mintProof } = useProofMint({ account, client })

  async function signReadiness() {
    try {
      const signature = await signMessage(createReadinessMessage({ canonicalJson, metadataUri, packetHash }))
      setReadinessSignature(signature)
      toast.success('Readiness message signed')
    } catch (error) {
      toast.error('Could not sign readiness message', { description: getErrorMessage(error, 'Unknown wallet error') })
    }
  }

  async function createProof() {
    if (!readinessSignature) {
      return
    }
    try {
      const result = await mintProof({
        metadataUri,
        name: packetTitle.slice(0, 32) || 'PosterProof Asset',
      })
      saveProofRecord({
        assetAddress: result.assetAddress,
        canonicalJson,
        createdAt: new Date().toISOString(),
        metadataUri,
        packet: JSON.parse(canonicalJson),
        packetHash,
        readinessSignature,
        scan,
        txSignature: result.txSignature,
      })
      toast.success('MPL Core proof minted')
    } catch (error) {
      toast.error('Could not mint proof asset', { description: getErrorMessage(error, 'Unknown mint error') })
    }
  }

  return (
    <PosterProofUiWalletStation
      account={account}
      canMint={Boolean(readinessSignature)}
      isMinting={isMinting}
      isSigning={isSigning}
      onMint={() => void createProof()}
      onSign={() => void signReadiness()}
      readinessSignature={readinessSignature}
    />
  )
}
