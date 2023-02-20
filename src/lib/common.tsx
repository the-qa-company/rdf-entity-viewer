import { Object as ObjectI, RdfJson } from './rdf-json'

export function isStandardReifiedStatement (data: RdfJson, object: ObjectI, labelIRIs: string[]): boolean {
  // After having removed the label predicates/objects, we check if the statement's object is
  // in the data. If it is, then it is a standard reified statement.

  // Only URIs and BNodes can be reified statements
  if (object.type !== 'uri' && object.type !== 'bnode') return false

  // Check if the object is in the data
  const predicates = data[object.value]
  if (predicates === undefined) return false
  const entries = Object.entries(predicates)
  return entries
    .filter(([p]) => !labelIRIs.includes(p)) // Remove label predicates
    .length > 0 // Check if there are any predicates left
}
