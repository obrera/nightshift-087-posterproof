import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/ui/card'

export function AboutFeature() {
  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center">
      <Card className="max-w-3xl border-border/60">
        <CardHeader className="gap-2">
          <CardTitle className="text-xl font-semibold tracking-tight">About</CardTitle>
          <CardDescription className="max-w-2xl text-sm/6">
            Nightshift 087 PosterProof is a devnet provenance workstation for creators who need canonical artwork
            packets, originality screening, wallet-signed readiness, and MPL Core proof minting when the required
            package publishes a usable create instruction.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
            <div className="text-sm font-medium">Canonical packets</div>
            <div className="mt-1 text-xs/relaxed text-muted-foreground">
              Packet fields are normalized into sorted JSON and hashed with browser WebCrypto for repeatable verifier
              evidence.
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
            <div className="text-sm font-medium">Wallet readiness</div>
            <div className="mt-1 text-xs/relaxed text-muted-foreground">
              Connected creators sign the exact hash, metadata URI, and byte length before any proof asset can be
              attempted.
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
            <div className="text-sm font-medium">Operator review</div>
            <div className="mt-1 text-xs/relaxed text-muted-foreground">
              Reviewers can inspect conflicts, rights language, metadata shape, and minted proof records with explorer
              links.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export { AboutFeature as Component }
