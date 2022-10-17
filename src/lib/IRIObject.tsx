import { CopyIRIButton } from './CopyButton'
import { formatIRI } from './format'
import { Object } from './rdf-json'
import { useViewerContext } from './viewer-context'

interface Props {
  object: Object
}

function IRIObject (props: Props): JSX.Element {
  const { object } = props
  if (object.type !== 'uri') throw new Error('IRIObject only supports IRIs')

  const { prefixes, LinkComponent } = useViewerContext()

  return (
    <span style={{ whiteSpace: 'nowrap' }}>
      <CopyIRIButton value={object.value} />
      <LinkComponent href={object.value}>
        {formatIRI(prefixes, object.value)}
      </LinkComponent>
    </span>
  )
}

export default IRIObject
