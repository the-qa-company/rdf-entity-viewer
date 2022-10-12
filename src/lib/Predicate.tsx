import React from 'react'
import { Objects } from './rdf-json'

const defaultHowManyVisibleObjects = 5

interface Props {
  predicate: string
  objects: Objects
}

function Predicate (props: Props): JSX.Element {
  const { predicate, objects } = props
  return <>hello world</>
}

export default Predicate
