import { Paper, Table, TableBody, TableContainer } from '@mui/material'
import { ComponentProps } from 'react'
import { mergeClasses } from './common-hooks'

interface Props {
  children: React.ReactNode
  tableContainerProps?: ComponentProps<typeof TableContainer>
}

function QualifierContainer (props: Props): JSX.Element {
  const { children, tableContainerProps } = props

  return (
    <TableContainer
      component={Paper}
      {...tableContainerProps}
      className={mergeClasses(
        'RdfEntityViewer-ObjectContainer',
        'RdfEntityViewer-QualifierContainer',
        tableContainerProps?.className
      )}
    >
      <Table size='small'>
        <TableBody>
          {children}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default QualifierContainer
