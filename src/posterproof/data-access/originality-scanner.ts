import type { CanonicalProofPacket } from './proof-packet'

export interface OriginalityMatch {
  overlap: number
  reasons: string[]
  reference: RegistryReference
}

export interface OriginalityScan {
  matches: OriginalityMatch[]
  readinessScore: number
  riskLevel: 'high' | 'low' | 'medium'
  suggestions: string[]
  warnings: string[]
}

export interface RegistryReference {
  creator: string
  hashPrefix: string
  medium: string
  title: string
  traits: string[]
}

const registry: RegistryReference[] = [
  {
    creator: 'Vela Archive',
    hashPrefix: 'b7d0c8a941',
    medium: 'screenprint poster',
    title: 'Midnight Platform Study',
    traits: ['transport', 'limited-print', 'nocturne', 'station'],
  },
  {
    creator: 'Mira Set',
    hashPrefix: '3abf779c5d',
    medium: 'digital collage',
    title: 'Transit Afterimage',
    traits: ['transport', 'collage', 'neon', 'urban'],
  },
  {
    creator: 'Fold House',
    hashPrefix: 'f019aa3242',
    medium: 'risograph poster',
    title: 'After Hours Transit',
    traits: ['risograph', 'limited-print', 'source-layered', 'nocturne'],
  },
  {
    creator: 'Studio Kin',
    hashPrefix: '87cfe04399',
    medium: 'editorial illustration',
    title: 'Harbor Proof Sheet',
    traits: ['proof-sheet', 'waterfront', 'commissioned', 'source-layered'],
  },
]

export function getReferenceRegistry() {
  return registry
}

export function scanProofPacket(packet: CanonicalProofPacket, packetHash: string): OriginalityScan {
  const matches = registry
    .map((reference) => scoreReference(packet, packetHash, reference))
    .filter((match) => match.overlap > 17)
    .sort((left, right) => right.overlap - left.overlap)

  const topScore = matches[0]?.overlap ?? 0
  const missingEvidence = packet.evidenceNotes.length < 90
  const weakRights = !/(copyright|license|reproduction|display|commercial|rights)/i.test(packet.rightsStatement)
  const sparseTraits = packet.traitTags.length < 3
  const warnings = [
    ...(topScore >= 74 ? ['High similarity to a registry item; add source-file evidence before minting.'] : []),
    ...(topScore >= 48 && topScore < 74 ? ['Moderate overlap detected; clarify authorship and release context.'] : []),
    ...(missingEvidence ? ['Evidence notes are too short for a durable proof packet.'] : []),
    ...(weakRights ? ['Rights statement should name allowed and restricted uses.'] : []),
    ...(sparseTraits ? ['Add at least three trait tags for verifier context.'] : []),
  ]
  const penalty = warnings.length * 8 + Math.max(0, topScore - 35)
  const readinessScore = Math.max(12, Math.min(98, 100 - penalty))

  return {
    matches,
    readinessScore,
    riskLevel:
      readinessScore < 52 || topScore >= 74 ? 'high' : readinessScore < 76 || topScore >= 48 ? 'medium' : 'low',
    suggestions: buildSuggestions({ missingEvidence, sparseTraits, topScore, weakRights }),
    warnings,
  }
}

function buildSuggestions({
  missingEvidence,
  sparseTraits,
  topScore,
  weakRights,
}: {
  missingEvidence: boolean
  sparseTraits: boolean
  topScore: number
  weakRights: boolean
}) {
  return [
    ...(topScore >= 48
      ? ['Attach process notes, source timestamps, or alternate sketches to distinguish the packet.']
      : []),
    ...(missingEvidence ? ['Add source-file provenance, export path, or edition proof notes.'] : []),
    ...(weakRights ? ['State copyright holder, granted display rights, and reproduction restrictions.'] : []),
    ...(sparseTraits ? ['Tag technique, subject, edition status, and evidence type.'] : []),
    'Mint only after the canonical hash matches your local evidence packet.',
  ]
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function scoreReference(
  packet: CanonicalProofPacket,
  packetHash: string,
  reference: RegistryReference,
): OriginalityMatch {
  const reasons: string[] = []
  let overlap = 0

  if (normalize(packet.title) === normalize(reference.title)) {
    overlap += 34
    reasons.push('exact title match')
  } else if (tokenOverlap(packet.title, reference.title) > 0.45) {
    overlap += 18
    reasons.push('near title phrase')
  }
  if (
    normalize(packet.medium).includes(normalize(reference.medium)) ||
    normalize(reference.medium).includes(normalize(packet.medium))
  ) {
    overlap += 16
    reasons.push('medium alignment')
  }

  const sharedTraits = packet.traitTags.filter((tag) => reference.traits.includes(normalize(tag)))
  overlap += sharedTraits.length * 12
  if (sharedTraits.length > 0) {
    reasons.push(`${sharedTraits.length} shared trait tags`)
  }
  if (packetHash.startsWith(reference.hashPrefix.slice(0, 6))) {
    overlap += 38
    reasons.push('hash prefix collision')
  }

  return { overlap: Math.min(100, overlap), reasons, reference }
}

function tokenOverlap(left: string, right: string) {
  const leftTokens = new Set(normalize(left).split(' ').filter(Boolean))
  const rightTokens = new Set(normalize(right).split(' ').filter(Boolean))
  const shared = [...leftTokens].filter((token) => rightTokens.has(token)).length
  return shared / Math.max(1, Math.min(leftTokens.size, rightTokens.size))
}
