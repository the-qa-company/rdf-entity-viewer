import React, { useEffect, useMemo, useState } from 'react'
import {
  Typography, Collapse, Paper, Box, Skeleton, Alert
} from '@mui/material'
import { RdfJson } from './rdf-json'
import { mergeClasses } from './common-hooks'
import CopyButton from './CopyButton'
import DefaultLink from './DefaultLink'
import Body from './Body'
import { ViewerContext, ViewerContextI } from './viewer-context'

import s from './RdfEntityViewer.module.scss'

export interface Props extends React.ComponentProps<typeof Paper> {
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
  /** Show a loader only for the body (not the title, a.k.a. the main IRI) */
  bodyLoading?: boolean
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
    loading: loadingProp = false,
    bodyLoading = false,
    onExpand,
    LinkComponent = DefaultLink,
    error: errorProp,
    ...otherProps
  } = props

  const [userExpanded, setUserExpanded] = useState(false)

  const error = useMemo(() => errorProp !== undefined, [errorProp])
  const loading = useMemo(() => loadingProp && !error, [loadingProp, error])

  const aDialogIsShown = useMemo(() => {
    const noData = (!loading && iri === undefined)
    return noData || error
  }, [loading, iri, error])

  const expanded = useMemo(() => {
    if (loading) return false
    if (aDialogIsShown) return false
    return userExpanded || forceExpanded
  }, [loading, aDialogIsShown, userExpanded, forceExpanded])

  const isHeaderClickable = useMemo(() => {
    if (forceExpanded) return false
    if (loading) return false
    if (aDialogIsShown) return false
    return true
  }, [forceExpanded, loading, aDialogIsShown])

  const showHeaderTitle = useMemo(() => iri !== undefined && !aDialogIsShown && !loading, [iri, aDialogIsShown, loading])
  const mountBody = useMemo(() => !bodyLoading && iri !== undefined && data !== undefined, [bodyLoading, iri, data])

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

  const contextValue: ViewerContextI = {
    data,
    iri
  }

  return (
    <ViewerContext.Provider value={contextValue}>
      <Paper className={mergeClasses(s.container, otherProps.className)} {...otherProps}>
        <Box className={s.innerContainer}>

          {/* Header */}
          <Box
            className={mergeClasses(s.header, isHeaderClickable && s.clickable)}
            onClick={() => isHeaderClickable && setUserExpanded(x => !x)}
          >
            <Typography variant='h4' className={s.title}>
              {showHeaderTitle && (
                <>
                  <CopyButton bigger value={iri!} title='Copy IRI' />
                  <LinkComponent href={iri!}>{label ?? iri!}</LinkComponent>
                </>
              )}
              {loading && (
                <Box className={s.skeletons}>
                  <Skeleton width={28} />
                  <Skeleton width={skeletonWidth} />
                </Box>
              )}
              {aDialogIsShown && (
                <Box className={s.dialog}>
                  <Alert severity='error'>{errorProp ?? 'No data'}</Alert>
                </Box>
              )}
            </Typography>
          </Box>

          {/* Body */}
          <Collapse in={expanded}>
            <Box className={s.body}>
              {bodyLoading && (
                <Box className={s.skeletonsVertical}>
                  {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} height={28} />)}
                </Box>
              )}
              {mountBody && (
                <Body />
              )}
            </Box>
          </Collapse>

        </Box>
      </Paper>
    </ViewerContext.Provider>
  )
}

export default RdfEntityViewer

export type { RdfJson }
