export interface CanonicalProofPacket {
  creatorAlias: string
  evidenceNotes: string
  medium: string
  releaseIntent: string
  rightsStatement: string
  title: string
  traitTags: string[]
}

export interface ProofPacket {
  creatorAlias: string
  evidenceNotes: string
  medium: string
  releaseIntent: string
  rightsStatement: string
  title: string
  traitTags: string[]
}

export const defaultProofPacket: ProofPacket = {
  creatorAlias: 'North Window Studio',
  evidenceNotes:
    'Layered poster proof exported from original source file. Includes sketch date, print-ready crop marks, and revision notes.',
  medium: 'Risograph poster',
  releaseIntent: 'Limited edition print run and online portfolio publication',
  rightsStatement:
    'Creator retains copyright. Buyer receives display rights only; no reproduction, resale of files, or model-training license.',
  title: 'After Hours Transit',
  traitTags: ['nocturne', 'transport', 'limited-print', 'source-layered'],
}

export function canonicalizeProofPacket(packet: ProofPacket): CanonicalProofPacket {
  return {
    creatorAlias: packet.creatorAlias.trim(),
    evidenceNotes: packet.evidenceNotes.trim(),
    medium: packet.medium.trim(),
    releaseIntent: packet.releaseIntent.trim(),
    rightsStatement: packet.rightsStatement.trim(),
    title: packet.title.trim(),
    traitTags: packet.traitTags
      .map((tag) => tag.trim())
      .filter(Boolean)
      .sort((left, right) => left.localeCompare(right)),
  }
}

export async function hashCanonicalJson(canonicalJson: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonicalJson))
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function stringifyCanonicalJson(value: unknown) {
  return JSON.stringify(sortForCanonicalJson(value), null, 2)
}

function sortForCanonicalJson(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortForCanonicalJson)
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entry]) => [key, sortForCanonicalJson(entry)]),
    )
  }
  return value
}
