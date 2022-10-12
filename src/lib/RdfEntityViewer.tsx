import React, { useEffect, useMemo, useState } from 'react'
import {
  Typography, Collapse, Paper, Box, Skeleton, Alert
} from '@mui/material'
import { RdfJson } from './rdf-json'
import { mergeClasses } from './common-hooks'
import CopyButton from './CopyButton'
import DefaultLink from './DefaultLink'

import s from './RdfEntityViewer.module.scss'

interface Props extends React.ComponentProps<typeof Paper> {
  /** The IRI of the main entity */
  iri?: string
  /** Force the label of the main entity, useful when data is not yet available */
  label?: string
  /** The data used to render the subjects, objects and predicates (rdf+json) */
  data?: RdfJson
  /** Make the component expanded, ignores the other props */
  forceExpanded?: boolean
  /** Show a loader */
  loading?: boolean
  /** Called when the component is expanded, useful to know when to make a request */
  onExpand?: () => void
  /** Overwrite the link component used to render links, useful when you want to use react-router */
  LinkComponent?: typeof DefaultLink
  /** Define an error to be printed */
  error?: string
}

/**
 * A table that displays a RDF entity's predicates and objects.
 */
function RdfEntityViewer (props: Props): JSX.Element {
  const {
    iri,
    data,
    forceExpanded = false,
    label: labelProp,
    loading = false,
    onExpand,
    LinkComponent = DefaultLink,
    error: errorProp,
    ...otherProps
  } = props

  const [userExpanded, setUserExpanded] = useState(false)
  const expanded = useMemo(() => userExpanded || forceExpanded, [userExpanded, forceExpanded])
  const isHeaderClickable = useMemo(() => {
    if (forceExpanded) return false
    if (loading) return false
    if (errorProp !== undefined) return false
    if (!loading && iri === undefined) return false
    return true
  }, [forceExpanded, loading, errorProp])

  // Call onExpand when the component is expanded
  useEffect(() => {
    if (expanded) onExpand?.()
  }, [expanded])

  const label = useMemo(() => {
    if (labelProp !== undefined) return labelProp
    // TODO: use the label from the data
    return iri
  }, [labelProp, iri])

  const skeletonWidth = useMemo(() => Math.round(Math.random() * 200) + 240, [])

  return (
    <Paper className={mergeClasses(s.container, otherProps.className)} {...otherProps}>
      <Box className={s.innerContainer}>

        {/* Header */}
        <Box
          className={mergeClasses(s.header, isHeaderClickable && s.clickable)}
          onClick={() => isHeaderClickable && setUserExpanded(x => !x)}
        >
          <Typography variant='h4' className={s.title}>
            {(iri !== undefined && errorProp === undefined && !loading) && (
              <>
                <CopyButton bigger value={iri} title='Copy IRI' />
                <LinkComponent href={iri}>{label ?? iri}</LinkComponent>
              </>
            )}
            {(loading && errorProp === undefined) && (
              <Box className={s.skeletons}>
                <Skeleton width={28} />
                <Skeleton width={skeletonWidth} />
              </Box>
            )}
            {((!loading && iri === undefined) || errorProp !== undefined) && (
              <Box className={s.dialog}>
                <Alert severity='error'>{errorProp ?? 'No data'}</Alert>
              </Box>
            )}
          </Typography>
        </Box>

        {/* Body */}
        <Collapse in={expanded}>
          <Box sx={{ padding: '20px' }}>
            hello world
          </Box>
        </Collapse>

      </Box>
    </Paper>
  )
}

export default RdfEntityViewer

export type { RdfJson }
