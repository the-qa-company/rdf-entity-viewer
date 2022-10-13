import { Box } from '@mui/material'
import { Objects as ObjectsI } from './rdf-json'
import { CopyIRIButton } from './CopyButton'
import { useViewerContext } from './viewer-context'
import Objects from './Objects'

import s from './Predicate.module.scss'

interface Props {
  predicate: string
  objects: ObjectsI
}

function Predicate (props: Props): JSX.Element {
  const { predicate, objects } = props
  const { LinkComponent } = useViewerContext()
  return (
    <Box className={s.container}>

      <Box className={s.predicate}>
        <Box className={s.content}>
          <CopyIRIButton value={predicate} />
          <LinkComponent href={predicate}>
            {predicate}
          </LinkComponent>
        </Box>
        {/* TODO: <Retract /> */}
      </Box>

      <Box className={s.objects}>
        <Objects objects={objects} />
      </Box>

    </Box>
  )
}

export default Predicate
