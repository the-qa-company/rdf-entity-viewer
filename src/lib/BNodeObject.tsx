import { useEffect, useState } from 'react'
import { getLabel } from './format'
import { Object } from './rdf-json'
import { useViewerContext } from './viewer-context'

interface Props {
  object: Object
}

function BNodeObject (props: Props): JSX.Element {
  const { object } = props
  if (object.type !== 'bnode') throw new Error('BNodeObject only supports BNodes')

  const viewerCtx = useViewerContext()

  const [label, setLabel] = useState<string>()
  useEffect(() => {
    setLabel(getLabel(viewerCtx, object.value))
  }, [viewerCtx, object.value])

  return (
    <span style={{ whiteSpace: 'nowrap' }}>
      {label ?? object.value}
    </span>
  )
}

export default BNodeObject
