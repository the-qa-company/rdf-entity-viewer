import { Object as RdfObject } from './rdf-json'
import { ViewerContextI } from './viewer-context'

export const formatIRI = (viewerCtx: ViewerContextI, iri: string): string => {
  const { prefixes } = viewerCtx

  // Check for a label
  const label = getLabel(viewerCtx, iri)
  if (label !== undefined) return label

  // Check for a prefix
  let longestPrefix: string | undefined
  for (const [prefix, base] of Object.entries(prefixes)) {
    if (iri.startsWith(base)) {
      if (longestPrefix === undefined || longestPrefix.length < prefix.length) {
        longestPrefix = prefix
      }
    }
  }
  if (longestPrefix !== undefined) {
    return `${longestPrefix}:${iri.slice(prefixes[longestPrefix].length)}`
  }

  // Default display
  return `<${iri}>`
}

export const getLabel = (viewerCtx: ViewerContextI, iri: string): string | undefined => {
  const { data, labelIRIs, locale } = viewerCtx
  // No data => no label
  if (data === undefined) return undefined
  // Get the predicates for the IRI
  const predicates = data[iri]
  if (predicates === undefined) return undefined
  // Go through the label IRIs and find the best label possible
  let bestLabel: RdfObject | undefined
  let bestLabelCondition: 'no-lang' | 'en-fallback' | undefined // Store the condition that made the label the best
  for (const labelIRI of labelIRIs) {
    const labels = predicates[labelIRI]
    if (labels !== undefined) {
      for (const label of labels) {
        if (label.lang === locale.language) {
          return label.value // Best match
        } else if (label.lang === undefined) {
          if (bestLabelCondition === undefined || bestLabelCondition === 'en-fallback') {
            bestLabel = label // No-lang match (2st best)
            bestLabelCondition = 'no-lang'
          }
        } else if (label.lang === 'en' && bestLabel === undefined) {
          if (bestLabelCondition === undefined) {
            bestLabel = label // English match (3rd best)
            bestLabelCondition = 'en-fallback'
          }
        }
      }
    }
  }
  return bestLabel?.value
}
