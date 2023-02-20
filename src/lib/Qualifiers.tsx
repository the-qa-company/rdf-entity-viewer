import { Box, TableCell, TableRow } from '@mui/material'
import { CopyIRIButton } from './CopyButton'
import { formatIRI, getLabel } from './format'
import QualifierContainer from './QualifierContainer'
import { Object as ObjectI, Predicates } from './rdf-json'
import SimpleObject from './SimpleObject'
import { useViewerContext } from './viewer-context'

interface Props {
  object: ObjectI
}

function Qualifiers (props: Props): JSX.Element | null {
  const { object: qualifierObject } = props

  const viewerCtx = useViewerContext()
  const { data, LinkComponent } = viewerCtx
  if (data === undefined) throw new Error('Qualifiers requires data')

  const predicates: Predicates | undefined = data[qualifierObject.value]
  if (predicates === undefined) return null

  const predicateKeys = Object.keys(predicates)

  return (
    <QualifierContainer>
      {predicateKeys.map((predicate) => (
        <TableRow key={predicate}>
          <TableCell sx={{ whiteSpace: 'nowrap', maxWidth: '500px', minWidth: '200px' }}>
            <CopyIRIButton value={predicate} />
            <LinkComponent href={predicate} label={getLabel(viewerCtx, predicate)}>
              {formatIRI(viewerCtx, predicate)}
            </LinkComponent>
          </TableCell>
          <TableCell>
            {predicates[predicate].map((object, i) => (
              <Box key={i}>
                <SimpleObject object={object} noContainer />
              </Box>
            ))}
          </TableCell>
        </TableRow>
      ))}
    </QualifierContainer>
  )
}

export default Qualifiers
