import ObjectContainer from './ObjectContainer'
import { Object } from './rdf-json'

interface Props {
  object: Object
}

function SimpleObject (props: Props): JSX.Element {
  const { object } = props
  return (
    <ObjectContainer>
      {object.value}
    </ObjectContainer>
  )
}

export default SimpleObject
