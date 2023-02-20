import { Box, TableCell, TableRow } from '@mui/material'
import { useMemo } from 'react'
import { compareObjects, comparePredicates } from './common'
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

  const predicateKeys = useMemo(() => {
    return Object.keys(predicates)
      .sort((a, b) => comparePredicates(viewerCtx, a, b))
  }, [predicates])

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
            {predicates[predicate].sort((a, b) => compareObjects(viewerCtx, a, b)).map((object, i) => (
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
