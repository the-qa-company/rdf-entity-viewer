import { useEffect, useState } from 'react'
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

  const [isImg, setIsImg] = useState(false)
  useEffect(() => {
    const img = new Image()
    img.onload = () => setIsImg(true)
    img.onerror = () => setIsImg(false)
    img.src = object.value
  }, [])

  return (
    <span style={{ whiteSpace: 'nowrap' }}>
      {isImg
        ? (
          <LinkComponent href={object.value}>
            <img src={object.value} alt={object.value} style={{ maxWidth: '200px', maxHeight: '200px' }} />
          </LinkComponent>
          )
        : (
          <>
            <CopyIRIButton value={object.value} />
            <LinkComponent href={object.value}>
              {formatIRI(prefixes, object.value)}
            </LinkComponent>
          </>
          )}
    </span>
  )
}

export default IRIObject
