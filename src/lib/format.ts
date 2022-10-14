import { RdfJson } from './rdf-json'

export const formatIRI = (prefixes: Record<string, string>, iri: string): string => {
  for (const [prefix, base] of Object.entries(prefixes)) {
    if (iri.startsWith(base)) {
      return `${prefix}:${iri.slice(base.length)}`
    }
  }
  return `<${iri}>`
}

export const getLabel = (data: RdfJson, labelIRIs: string[], locale: Intl.Locale, iri: string): string | undefined => {
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
