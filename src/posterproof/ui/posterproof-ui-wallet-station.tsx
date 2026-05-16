import { type UiWalletAccount } from '@wallet-ui/react'
import { CheckCircle2, Stamp } from 'lucide-react'

import { Button } from '@/core/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/core/ui/card'
import { SolanaUiAddress } from '@/solana/ui/solana-ui-address'
import { SolanaUiWalletDropdown } from '@/solana/ui/solana-ui-wallet-dropdown'

export function PosterProofUiWalletStation({
  account,
  canMint,
  isMinting,
  isSigning,
  onMint,
  onSign,
  readinessSignature,
}: {
  account?: UiWalletAccount
  canMint: boolean
  isMinting: boolean
  isSigning: boolean
  onMint: () => void
  onSign: () => void
  readinessSignature: string
}) {
  return (
    <Card className="bg-zinc-950/60">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="flex items-center gap-2">
          <Stamp className="size-4 text-emerald-300" />
          Wallet proof station
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <SolanaUiWalletDropdown className="w-full" />
        <div className="rounded-md border border-white/10 bg-black/25 p-3">
          <div className="text-muted-foreground">Connected account</div>
          <div className="mt-1 font-mono text-xs">
            {account ? <SolanaUiAddress address={account.address} len={10} /> : 'No wallet connected'}
          </div>
        </div>
        <Button disabled={!account || isSigning} onClick={onSign} variant="secondary">
          <CheckCircle2 />
          {isSigning ? 'Requesting signature' : 'Sign readiness'}
        </Button>
        <Button disabled={!canMint || isMinting} onClick={onMint}>
          <Stamp />
          {isMinting ? 'Minting proof asset' : 'Mint MPL Core proof'}
        </Button>
        {readinessSignature ? (
          <p className="rounded-md border border-emerald-300/20 bg-emerald-300/10 p-3 font-mono text-[0.68rem] leading-5 break-all text-emerald-100">
            {readinessSignature}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
