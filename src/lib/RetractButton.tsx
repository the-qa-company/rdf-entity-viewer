import { Box, IconButton, Paper, Tooltip } from '@mui/material'
import { UnfoldLess as UnfoldLessIcon } from '@mui/icons-material'

import s from './RetractButton.module.scss'

interface Props {
  visible?: boolean
  onClick?: () => void
}

function RetractButton (props: Props): JSX.Element {
  const { visible = true, onClick } = props

  return (
    <Box
      className={s.container}
      sx={{ display: visible ? undefined : 'none' }}
    >
      <Box
        className={s.line}
        sx={theme => ({ bgcolor: theme.palette.divider })}
      />
      <Paper
        className={s.btn}
        elevation={1}
        sx={{ boxShadow: 'none' }}
      >
        <Tooltip title='Collapse' placement='left'>
          <IconButton onClick={onClick} sx={{ borderRadius: '8px' }}>
            <UnfoldLessIcon />
          </IconButton>
        </Tooltip>
      </Paper>
    </Box>
  )
}

export default RetractButton
