import React from 'react'
import { IconButton, Tooltip } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

interface Props {
  value: string
  smaller?: boolean
  bigger?: boolean
  onCopy?: () => void
  title?: string
}

function CopyButton (props: Props): JSX.Element {
  const { value, smaller = false, bigger = false, onCopy, title } = props
  if (bigger && smaller) throw new Error('CopyButton: cannot be both bigger and smaller')
  return (
    <Tooltip title={title ?? 'Copy'} arrow disableInteractive>
      <IconButton
        size='small'
        sx={{ marginRight: '5px' }}
        onClick={e => {
          e.stopPropagation()
          navigator.clipboard.writeText(value)
            .then(() => onCopy?.())
            .catch(console.error)
        }}
      >
        <ContentCopyIcon sx={theme => ({ color: theme.palette.text.secondary, fontSize: smaller ? '12px' : (bigger ? '24px' : '16px') })} />
      </IconButton>
    </Tooltip>
  )
}

export default CopyButton
