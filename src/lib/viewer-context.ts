import { createContext, useContext } from 'react'
import { Props as RdfEntityViewerProps } from './RdfEntityViewer'

export type ViewerContextI = Pick<RdfEntityViewerProps, 'data' | 'iri'>

export const ViewerContext = createContext<ViewerContextI | undefined>(undefined)

export const useViewerContext = (): ViewerContextI => {
  const context = useContext(ViewerContext)
  if (context === undefined) throw new Error('useViewerContext must be used within a ContextProvider')
  return context
}
