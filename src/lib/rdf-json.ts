// Based on https://www.w3.org/TR/rdf-json

export interface RdfJson {
  [iri: string]: Predicates
}

export interface Predicates {
  [iri: string]: Objects
}

export type Objects = Object[]

export interface Object {
  type: ObjectType
  value: string
  datatype?: string
  lang?: string
}

export type ObjectType = 'uri' | 'literal' | 'bnode'
