export const formatIRI = (prefixes: Record<string, string>, iri: string): string => {
  for (const [prefix, base] of Object.entries(prefixes)) {
    if (iri.startsWith(base)) {
      return `${prefix}:${iri.slice(base.length)}`
    }
  }
  return `<${iri}>`
}
