import { Box, useTheme } from '@mui/material'
import { Object } from './rdf-json'

interface Props {
  object: Object
}

function LiteralObject (props: Props): JSX.Element {
  const { object } = props
  if (object.type !== 'literal') throw new Error('LiteralObject only supports literals')
  const grey = useTheme().palette.grey[500]
  if (typeof object.lang === 'string') {
    return <Box display='flex'>{object.value}<Box color={grey}>@{object.lang}</Box></Box>
  }
  if (typeof object.datatype === 'string') {
    return <Box display='flex'>{object.value}<Box color={grey}>^^{object.datatype}</Box></Box>
  }
  return <>{object.value}</>
}

export default LiteralObject
