import { useSyncExternalStore } from 'react'

import { loadProofRecords, refreshProofRecords } from './proof-record'

export function useProofRecords() {
  return useSyncExternalStore(subscribeToProofRecords, loadProofRecords, getServerProofRecords)
}

function getServerProofRecords() {
  return []
}

function subscribeToProofRecords(onStoreChange: () => void) {
  const handleStorage = () => {
    refreshProofRecords()
    onStoreChange()
  }

  window.addEventListener('storage', handleStorage)
  window.addEventListener('posterproof:proof-records', onStoreChange)

  return () => {
    window.removeEventListener('storage', handleStorage)
    window.removeEventListener('posterproof:proof-records', onStoreChange)
  }
}
