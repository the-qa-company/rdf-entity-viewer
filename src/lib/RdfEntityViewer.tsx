import React, { useEffect, useMemo, useState } from 'react'
import {
  Typography, Collapse, Paper, Box, Skeleton, Alert
} from '@mui/material'
import { RdfJson } from './rdf-json'
import { mergeClasses } from './common-hooks'
import { CopyIRIButton } from './CopyButton'
import DefaultLink from './DefaultLink'
import Body from './Body'
import { ViewerContext, ViewerContextI } from './viewer-context'
import { formatIRI, getLabel } from './format'

import './global.scss'

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
  /** Define the prefixes that should be used to render IRIs.
   * The keys are the prefixes, do not include the colon.
   * The values are the IRI of the prefix.
  */
  prefixes?: Record<string, string>
  /** IRIs used to show labels */
  labelIRIs?: string[]
  /** Overwrite the default locale */
  locale?: Intl.Locale | string
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
    bodyLoading: bodyLoadingProp = false,
    onExpand,
    LinkComponent: LinkComponentProp = DefaultLink,
    error: errorProp,
    prefixes = { xsd: 'http://www.w3.org/2001/XMLSchema#' },
    labelIRIs = ['http://www.w3.org/2000/01/rdf-schema#label'],
    locale: localeProp,
    ...otherProps
  } = props

  const locale = useMemo(() => {
    if (localeProp === undefined) return new Intl.Locale(navigator.language)
    if (typeof localeProp === 'string') return new Intl.Locale(localeProp)
    return localeProp
  }, [localeProp])

  const [userExpanded, setUserExpanded] = useState(false)

  const error = useMemo(() => errorProp !== undefined, [errorProp])
  const loading = useMemo(() => loadingProp && !error, [loadingProp, error])
  const bodyLoading = useMemo(() => loading || bodyLoadingProp, [loading, bodyLoadingProp])

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
  const mountBody = useMemo(() => !bodyLoading && iri !== undefined, [bodyLoading, iri])

  // Call onExpand when the component is expanded
  useEffect(() => {
    if (expanded) onExpand?.()
  }, [expanded])

  const skeletonWidth = useMemo(() => Math.round(Math.random() * 200) + 240, [])

  // eslint-disable-next-line react/display-name, react/prop-types
  const LinkComponent = useMemo((): typeof DefaultLink => ({ children, ...otherProps }) => (
    <span className={s.linkComponentContainer}>
      <LinkComponentProp {...otherProps}>
        {children}
      </LinkComponentProp>
    </span>
  ), [])

  const contextValue: ViewerContextI = useMemo(() => ({
    data,
    iri,
    LinkComponent,
    prefixes,
    labelIRIs,
    locale
  }), [data, iri, LinkComponent, prefixes, labelIRIs, locale])

  const label = useMemo(() => {
    if (labelProp !== undefined) return labelProp
    if (contextValue.iri === undefined) return undefined
    return getLabel(contextValue, contextValue.iri)
  }, [contextValue, labelProp])

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
                  <CopyIRIButton bigger value={iri!} />
                  <LinkComponent href={iri!}>
                    {label !== undefined ? label : formatIRI(contextValue, iri!)}
                  </LinkComponent>
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
