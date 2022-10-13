import { Paper, Table, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { Object } from './rdf-json'

interface Props {
  object: Object
}

function SimpleObject (props: Props): JSX.Element {
  const { object } = props
  return (
    <TableContainer
      component={Paper}
      className='RdfEntityViewer-ObjectContainer'
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              {object.value}
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>
    </TableContainer>
  )
}

export default SimpleObject
