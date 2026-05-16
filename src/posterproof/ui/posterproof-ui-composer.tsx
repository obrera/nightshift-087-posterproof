import { FileText, Fingerprint } from 'lucide-react'

import { Badge } from '@/core/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/core/ui/card'
import { Input } from '@/core/ui/input'

import type { ProofPacket } from '../data-access/proof-packet'

import { PosterProofUiField } from './posterproof-ui-field'

export function PosterProofUiComposer({
  canonicalJson,
  packet,
  packetHash,
  setPacket,
}: {
  canonicalJson: string
  packet: ProofPacket
  packetHash: string
  setPacket: (packet: ProofPacket) => void
}) {
  return (
    <Card className="border border-emerald-400/10 bg-zinc-950/70 shadow-2xl shadow-black/20">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="size-4 text-emerald-300" />
          Proof packet composer
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <PosterProofUiField
            label="Title"
            onChange={(title) => setPacket({ ...packet, title })}
            value={packet.title}
          />
          <PosterProofUiField
            label="Creator alias"
            onChange={(creatorAlias) => setPacket({ ...packet, creatorAlias })}
            value={packet.creatorAlias}
          />
          <PosterProofUiField
            label="Medium/category"
            onChange={(medium) => setPacket({ ...packet, medium })}
            value={packet.medium}
          />
          <PosterProofUiField
            label="Release intent"
            onChange={(releaseIntent) => setPacket({ ...packet, releaseIntent })}
            value={packet.releaseIntent}
          />
        </div>
        <PosterProofUiField
          label="Rights statement"
          onChange={(rightsStatement) => setPacket({ ...packet, rightsStatement })}
          textarea
          value={packet.rightsStatement}
        />
        <PosterProofUiField
          label="Evidence notes"
          onChange={(evidenceNotes) => setPacket({ ...packet, evidenceNotes })}
          textarea
          value={packet.evidenceNotes}
        />
        <label className="grid gap-1.5">
          <span className="text-[0.68rem] tracking-[0.12em] text-muted-foreground uppercase">Trait tags</span>
          <Input
            onChange={(event) =>
              setPacket({
                ...packet,
                traitTags: event.target.value
                  .split(',')
                  .map((tag) => tag.trim())
                  .filter(Boolean),
              })
            }
            value={packet.traitTags.join(', ')}
          />
        </label>
        <div className="grid gap-3 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-md border border-white/10 bg-black/30 p-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-emerald-200">
              <Fingerprint className="size-3.5" />
              SHA-256 content hash
            </div>
            <p className="font-mono text-[0.68rem] leading-5 break-all text-zinc-300">{packetHash}</p>
          </div>
          <pre className="max-h-52 overflow-auto rounded-md border border-white/10 bg-black/40 p-3 text-[0.68rem] leading-5 text-zinc-300">
            {canonicalJson}
          </pre>
        </div>
        <div className="flex flex-wrap gap-2">
          {packet.traitTags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
