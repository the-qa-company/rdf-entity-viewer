import { ViewerContextI } from './viewer-context'

export const formatIRI = (viewerCtx: ViewerContextI, iri: string): string => {
  const { prefixes } = viewerCtx

  // Check for a label
  const label = getLabel(viewerCtx, iri)
  if (label !== undefined) return label

  // Check for a prefix
  for (const [prefix, base] of Object.entries(prefixes)) {
    if (iri.startsWith(base)) {
      return `${prefix}:${iri.slice(base.length)}`
    }
  }

  // Default display
  return `<${iri}>`
}

export const getLabel = (viewerCtx: ViewerContextI, iri: string): string | undefined => {
  const { data, labelIRIs, locale } = viewerCtx
  if (data === undefined) return undefined
  const predicates = data[iri]
  if (predicates === undefined) return undefined
  for (const labelIRI of labelIRIs) {
    const labels = predicates[labelIRI]
    if (labels !== undefined) {
      for (const label of labels) {
        if (label.lang === locale.language) {
          return label.value
        }
      }
    }
  }
  return undefined
}
