import { Alert, Box, Divider } from '@mui/material'
import React, { useMemo } from 'react'
import { useViewerContext } from './viewer-context'
import Predicate from './Predicate'
import { formatIRI } from './format'

function Body (): JSX.Element {
  const viewerCtx = useViewerContext()
  const { data, iri } = viewerCtx
  if (iri === undefined) throw new Error('Body: context is missing information')

  const predicates = useMemo(() => data?.[iri], [data])
  const entries = useMemo(() => {
    if (predicates === undefined) return undefined
    return Object.entries(predicates)
      // Sort predicates alphabetically
      .sort(([a], [b]) => {
        const fmtA = formatIRI(viewerCtx, a)
        const fmtB = formatIRI(viewerCtx, b)
        return fmtA.localeCompare(fmtB)
      })
  }, [predicates])

  if (entries === undefined) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Alert severity='error'>No data</Alert>
      </Box>
    )
  }

  return (
    <>
      {entries.map(([predicate, objects], i) => (
        <React.Fragment key={predicate}>
          <Predicate predicate={predicate} objects={objects} />
          {i < entries.length - 1 && <Divider sx={{ margin: '0 20px' }} />}
        </React.Fragment>
      ))}
    </>
  )
}

export default Body
