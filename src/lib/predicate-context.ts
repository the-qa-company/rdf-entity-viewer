import { createContext, useContext } from 'react'

export interface PredicateContextI {
  howManyVisibleObjects: number
  setHowManyVisibleObjects: (howManyVisibleObjects: number) => void
}

export const PredicateContext = createContext<PredicateContextI | undefined>(undefined)

export const usePredicateContext = (): PredicateContextI => {
  const context = useContext(PredicateContext)
  if (context === undefined) throw new Error('usePredicateContext must be used within a ContextProvider')
  return context
}
