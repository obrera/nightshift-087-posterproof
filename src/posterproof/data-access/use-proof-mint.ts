import { useMutation } from '@tanstack/react-query'
import { type UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'

import type { SolanaClient } from '@/solana/data-access/solana-client'

import { executeProofMint, type ProofMintInput } from './execute-proof-mint'

export function useProofMint({ account, client }: { account: UiWalletAccount; client: SolanaClient }) {
  const transactionSigner = useWalletUiSigner({ account })

  const { isPending: isMinting, mutateAsync: mintProof } = useMutation({
    mutationFn: (input: Omit<ProofMintInput, 'client' | 'transactionSigner'>) =>
      executeProofMint({ ...input, client, transactionSigner }),
  })

  return { isMinting, mintProof }
}
