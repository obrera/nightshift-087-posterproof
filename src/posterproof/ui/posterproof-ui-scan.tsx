import { AlertTriangle, ShieldCheck } from 'lucide-react'

import { Badge } from '@/core/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/core/ui/card'

import type { OriginalityScan } from '../data-access/originality-scanner'

export function PosterProofUiScan({ scan }: { scan: OriginalityScan }) {
  return (
    <Card className="bg-zinc-950/60">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-cyan-300" />
            Originality scanner
          </span>
          <Badge
            variant={scan.riskLevel === 'high' ? 'destructive' : scan.riskLevel === 'medium' ? 'secondary' : 'default'}
          >
            {scan.riskLevel} risk
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Readiness score</span>
            <span className="font-mono">{scan.readinessScore}/100</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-emerald-300" style={{ width: `${scan.readinessScore}%` }} />
          </div>
        </div>
        {scan.matches.length > 0 ? (
          <div className="grid gap-2">
            {scan.matches.slice(0, 3).map((match) => (
              <div className="rounded-md border border-white/10 bg-black/25 p-3" key={match.reference.hashPrefix}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{match.reference.title}</div>
                    <div className="text-muted-foreground">
                      {match.reference.creator} · {match.reference.medium}
                    </div>
                  </div>
                  <span className="font-mono text-xs text-cyan-200">{match.overlap}%</span>
                </div>
                <p className="mt-2 text-muted-foreground">{match.reasons.join(', ')}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-md border border-emerald-300/20 bg-emerald-300/10 p-3 text-emerald-100">
            No close registry conflicts found.
          </p>
        )}
        <div className="grid gap-2">
          {[...scan.warnings, ...scan.suggestions].slice(0, 6).map((warning) => (
            <div className="flex gap-2 text-muted-foreground" key={warning}>
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-300" />
              <span>{warning}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
