import { Divider } from '@mui/material'
import React, { useMemo } from 'react'
import { useViewerContext } from './viewer-context'
import Predicate from './Predicate'

function Body (): JSX.Element {
  const { data, iri } = useViewerContext()
  if (iri === undefined || data === undefined) throw new Error('Body: context is missing information')

  const predicates = useMemo(() => data[iri], [])
  if (predicates === undefined) throw new Error('Body: The given IRI is not in the data')
  const entries = useMemo(() => Object.entries(predicates), [predicates])

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
