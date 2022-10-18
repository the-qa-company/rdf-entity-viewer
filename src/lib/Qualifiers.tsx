import { Box, TableCell, TableRow } from '@mui/material'
import { CopyIRIButton } from './CopyButton'
import { formatIRI } from './format'
import QualifierContainer from './QualifierContainer'
import { Object as ObjectI, Predicates } from './rdf-json'
import SimpleObject from './SimpleObject'
import { useViewerContext } from './viewer-context'

interface Props {
  bnode: ObjectI
}

function Qualifiers (props: Props): JSX.Element | null {
  const { bnode } = props
  if (bnode.type !== 'bnode') throw new Error('Qualifiers only supports bnodes')

  const viewerCtx = useViewerContext()
  const { data, LinkComponent } = viewerCtx
  if (data === undefined) throw new Error('Qualifiers requires data')

  const bnodeData: Predicates | undefined = data[bnode.value]
  if (bnodeData === undefined) return null

  const predicates = Object.keys(bnodeData)

  return (
    <QualifierContainer>
      {predicates.map((predicate) => (
        <TableRow key={predicate}>
          <TableCell sx={{ whiteSpace: 'nowrap', maxWidth: '500px', minWidth: '200px' }}>
            <CopyIRIButton value={predicate} />
            <LinkComponent href={predicate}>
              {formatIRI(viewerCtx, predicate)}
            </LinkComponent>
          </TableCell>
          <TableCell>
            {bnodeData[predicate].map((object, i) => (
              <Box key={i}>
                {object.type === 'bnode'
                  ? object.value
                  : <SimpleObject object={object} noContainer />}
              </Box>
            ))}
          </TableCell>
        </TableRow>
      ))}
    </QualifierContainer>
  )
}

export default Qualifiers
