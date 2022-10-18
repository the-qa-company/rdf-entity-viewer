import { Box } from '@mui/material'
import { Objects as ObjectsI } from './rdf-json'
import { CopyIRIButton } from './CopyButton'
import { useViewerContext } from './viewer-context'
import Objects from './Objects'
import RetractButton from './RetractButton'
import { useMemo, useState } from 'react'
import { PredicateContext, PredicateContextI } from './predicate-context'
import { formatIRI } from './format'

import s from './Predicate.module.scss'

const defaultHowManyVisibleObjects = 5

interface Props {
  predicate: string
  objects: ObjectsI
}

function Predicate (props: Props): JSX.Element {
  const { predicate, objects } = props
  const viewerCtx = useViewerContext()
  const { LinkComponent } = viewerCtx

  const [howManyVisibleObjects, setHowManyVisibleObjects] = useState(defaultHowManyVisibleObjects)
  const objectsCanBeRetracted = useMemo(() => howManyVisibleObjects > defaultHowManyVisibleObjects, [howManyVisibleObjects])

  const resetHowManyVisibleObjects = (): void => {
    setHowManyVisibleObjects(defaultHowManyVisibleObjects)
  }

  const contextValue: PredicateContextI = {
    howManyVisibleObjects,
    setHowManyVisibleObjects
  }

  return (
    <PredicateContext.Provider value={contextValue}>
      <Box className={s.container}>

        <Box className={s.predicate}>
          <Box className={s.content}>
            <Box className={s.sticky}>
              <CopyIRIButton value={predicate} />
              <LinkComponent href={predicate}>
                {formatIRI(viewerCtx, predicate)}
              </LinkComponent>
            </Box>
          </Box>
          <RetractButton
            visible={objectsCanBeRetracted}
            onClick={resetHowManyVisibleObjects}
          />
        </Box>

        <Box className={s.objects}>
          <Objects objects={objects} />
        </Box>

      </Box>
    </PredicateContext.Provider>
  )
}

export default Predicate
