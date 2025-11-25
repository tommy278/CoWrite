import { createContext, useState, useContext } from 'react'
import type { ReactNode } from 'react'

// Context
export const IsSavingContext = createContext<{
  isSaving: boolean
  handleSave: () => void
  doneSaving: () => void
} | null>(null)

// Provider
export function IsSavingProvider({ children }: { children: ReactNode }) {
  const [savingCount, setSavingCount] = useState(0)

  const isSaving: boolean = savingCount > 0

  function handleSave() {
    setSavingCount((prev) => prev + 1)
  }

  function doneSaving() {
    setSavingCount(0)
  }

  return (
    <IsSavingContext.Provider value={{ isSaving, handleSave, doneSaving }}>
      {children}
    </IsSavingContext.Provider>
  )
}

// Hook for other components
export function useIsSaving() {
  const context = useContext(IsSavingContext)
  if (context === null) {
    throw new Error('Component not within provider')
  }
  return context
}
