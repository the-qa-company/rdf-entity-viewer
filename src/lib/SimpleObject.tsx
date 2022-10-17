import React, { useMemo } from 'react'
import IRIObject from './IRIObject'
import LiteralObject from './LiteralObject'
import ObjectContainer from './ObjectContainer'
import { Object } from './rdf-json'

interface Props {
  object: Object
  noContainer?: boolean
}

function SimpleObject (props: Props): JSX.Element {
  const { object, noContainer = false } = props
  if (object.type === 'bnode') throw new Error('SimpleObject does not support bnodes')

  const Enveloppe = useMemo(() => noContainer ? React.Fragment : ObjectContainer, [noContainer])

  return (
    <Enveloppe>
      {object.type === 'uri' && (
        <IRIObject object={object} />
      )}

      {object.type === 'literal' && (
        <LiteralObject object={object} />
      )}
    </Enveloppe>
  )
}

export default SimpleObject
