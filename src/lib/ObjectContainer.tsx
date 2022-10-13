import { Paper, Table, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { ComponentProps } from 'react'
import { mergeClasses } from './common-hooks'

interface Props {
  children: React.ReactNode
  tableContainerProps?: ComponentProps<typeof TableContainer>
  tableCellProps?: ComponentProps<typeof TableCell>
}

function ObjectContainer (props: Props): JSX.Element {
  const { children, tableCellProps, tableContainerProps } = props

  return (
    <TableContainer
      component={Paper}
      {...tableContainerProps}
      className={mergeClasses('RdfEntityViewer-ObjectContainer', tableContainerProps?.className)}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell {...tableCellProps}>
              {children}
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>
    </TableContainer>
  )
}

export default ObjectContainer
