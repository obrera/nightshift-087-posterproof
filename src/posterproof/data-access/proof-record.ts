import type { OriginalityScan } from './originality-scanner'
import type { CanonicalProofPacket } from './proof-packet'

export interface ProofRecord {
  assetAddress: string
  canonicalJson: string
  createdAt: string
  metadataUri: string
  packet: CanonicalProofPacket
  packetHash: string
  readinessSignature: string
  scan: OriginalityScan
  txSignature: string
}

const proofStorageKey = 'posterproof:proof-records'
let cachedProofRecords: ProofRecord[] | undefined

export function createMetadataUri(packetHash: string) {
  return `https://posterproof087.colmena.dev/metadata/${packetHash}.json`
}

export function createReadinessMessage({
  canonicalJson,
  metadataUri,
  packetHash,
}: {
  canonicalJson: string
  metadataUri: string
  packetHash: string
}) {
  return [
    'PosterProof readiness declaration',
    `packetHash=${packetHash}`,
    `metadataUri=${metadataUri}`,
    `canonicalJsonSha256=${packetHash}`,
    `canonicalJsonBytes=${new TextEncoder().encode(canonicalJson).byteLength}`,
  ].join('\n')
}

export function loadProofRecords(): ProofRecord[] {
  if (cachedProofRecords) {
    return cachedProofRecords
  }

  const raw = window.localStorage.getItem(proofStorageKey)
  if (!raw) {
    cachedProofRecords = []
    return cachedProofRecords
  }

  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      cachedProofRecords = parsed as ProofRecord[]
      return cachedProofRecords
    }
  } catch {
    cachedProofRecords = []
    return cachedProofRecords
  }

  cachedProofRecords = []
  return cachedProofRecords
}

export function refreshProofRecords() {
  cachedProofRecords = undefined
  return loadProofRecords()
}

export function saveProofRecord(record: ProofRecord) {
  const records = [record, ...loadProofRecords()].slice(0, 12)
  cachedProofRecords = records
  window.localStorage.setItem(proofStorageKey, JSON.stringify(records))
  window.dispatchEvent(new Event('posterproof:proof-records'))
  return records
}
