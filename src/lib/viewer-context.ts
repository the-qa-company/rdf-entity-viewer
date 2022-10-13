import { createContext, useContext } from 'react'
import DefaultLink from './DefaultLink'
import { RdfJson } from './rdf-json'

export interface ViewerContextI {
  data?: RdfJson
  iri?: string
  LinkComponent: typeof DefaultLink
}

export const ViewerContext = createContext<ViewerContextI | undefined>(undefined)

export const useViewerContext = (): ViewerContextI => {
  const context = useContext(ViewerContext)
  if (context === undefined) throw new Error('useViewerContext must be used within a ContextProvider')
  return context
}
