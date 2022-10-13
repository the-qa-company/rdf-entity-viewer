import ObjectContainer from './ObjectContainer'
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material'

interface Props {
  onClick?: () => void
}

function SeeMoreButton (props: Props): JSX.Element {
  const { onClick } = props
  return (
    <ObjectContainer
      tableCellProps={{
        onClick,
        sx: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          cursor: 'pointer',
          userSelect: 'none'
        }
      }}
    >
      <ExpandMoreIcon />
      See more
    </ObjectContainer>
  )
}

export default SeeMoreButton
