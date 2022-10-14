import { CopyIRIButton } from './CopyButton'
import LiteralObject from './LiteralObject'
import ObjectContainer from './ObjectContainer'
import { Object } from './rdf-json'
import { useViewerContext } from './viewer-context'

interface Props {
  object: Object
}

function SimpleObject (props: Props): JSX.Element {
  const { object } = props
  const { LinkComponent } = useViewerContext()
  if (object.type === 'bnode') throw new Error('SimpleObject does not support bnodes')
  return (
    <ObjectContainer>
      {object.type === 'uri' && (
        <>
          <CopyIRIButton value={object.value} />
          <LinkComponent href={object.value}>
            {object.value}
          </LinkComponent>
        </>
      )}

      {object.type === 'literal' && (
        <LiteralObject object={object} />
      )}
    </ObjectContainer>
  )
}

export default SimpleObject
