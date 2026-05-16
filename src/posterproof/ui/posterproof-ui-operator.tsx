import { ClipboardCheck, ExternalLink } from 'lucide-react'

import { Badge } from '@/core/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/core/ui/card'
import { Checkbox } from '@/core/ui/checkbox'
import { SolanaUiExplorerLink } from '@/solana/ui/solana-ui-explorer-link'

import type { ProofRecord } from '../data-access/proof-record'

export function PosterProofUiOperator({
  canonicalJson,
  packetHash,
  records,
}: {
  canonicalJson: string
  packetHash: string
  records: ProofRecord[]
}) {
  return (
    <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <Card className="bg-zinc-950/60">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="size-4 text-amber-300" />
            Operator review
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {[
            'Rights statement names holder and restrictions',
            'Evidence notes describe source material',
            'Conflict scan reviewed',
            'Metadata URI and hash copied into release record',
          ].map((item) => (
            <label className="flex items-center gap-2 rounded-md border border-white/10 bg-black/25 p-2" key={item}>
              <Checkbox />
              <span>{item}</span>
            </label>
          ))}
          <div className="rounded-md border border-white/10 bg-black/30 p-3">
            <div className="mb-1 text-muted-foreground">Metadata preview</div>
            <p className="font-mono text-[0.68rem] break-all text-zinc-300">
              name: PosterProof · hash: {packetHash || 'pending'} · json bytes:{' '}
              {new TextEncoder().encode(canonicalJson).byteLength}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-zinc-950/60">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="size-4 text-cyan-300" />
            Proof gallery and verifier
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {records.length > 0 ? (
            records.map((record) => (
              <article className="rounded-md border border-white/10 bg-black/25 p-3" key={record.txSignature}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-medium">{record.packet.title}</div>
                    <div className="text-muted-foreground">{new Date(record.createdAt).toLocaleString()}</div>
                  </div>
                  <Badge variant="outline">{record.scan.riskLevel} risk</Badge>
                </div>
                <p className="mt-2 font-mono text-[0.68rem] leading-5 break-all text-zinc-300">
                  hash {record.packetHash}
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs">
                  <SolanaUiExplorerLink label="asset" path={`/address/${record.assetAddress}`} />
                  <SolanaUiExplorerLink label="transaction" path={`/tx/${record.txSignature}`} />
                </div>
                <p className="mt-2 text-muted-foreground">
                  Verifier copy: wallet-signed MPL Core asset links this packet hash to {record.metadataUri}.
                </p>
              </article>
            ))
          ) : (
            <p className="rounded-md border border-dashed border-white/15 p-4 text-muted-foreground">
              Minted proofs appear here with asset and transaction links.
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
