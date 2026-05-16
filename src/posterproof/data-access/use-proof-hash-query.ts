import { useQuery } from '@tanstack/react-query'

import { canonicalizeProofPacket, hashCanonicalJson, type ProofPacket, stringifyCanonicalJson } from './proof-packet'

export function useProofHashQuery(packet: ProofPacket) {
  return useQuery({
    queryFn: async () => {
      const canonicalPacket = canonicalizeProofPacket(packet)
      const canonicalJson = stringifyCanonicalJson(canonicalPacket)
      const packetHash = await hashCanonicalJson(canonicalJson)

      return { canonicalJson, canonicalPacket, packetHash }
    },
    queryKey: ['posterproof', 'hash', packet],
  })
}
