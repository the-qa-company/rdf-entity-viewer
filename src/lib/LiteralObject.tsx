import { useTheme } from '@mui/material'
import { formatIRI } from './format'
import { Object } from './rdf-json'
import { useViewerContext } from './viewer-context'

interface Props {
  object: Object
}

function LiteralObject (props: Props): JSX.Element {
  const { object } = props
  if (object.type !== 'literal') throw new Error('LiteralObject only supports literals')

  const grey = useTheme().palette.grey[500]
  const { prefixes } = useViewerContext()

  if (typeof object.lang === 'string') {
    return <span>{object.value}<span style={{ color: grey }}>@{object.lang}</span></span>
  }
  if (typeof object.datatype === 'string') {
    return <span>{object.value}<span style={{ color: grey }}>^^{formatIRI(prefixes, object.datatype)}</span></span>
  }
  return <>{object.value}</>
}

export default LiteralObject
