import React from 'react'
import { styled } from '@mui/material/styles'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

/**
 * the table header
 * @param {Array[String]} colNames column names for the table header
 * @returns
 */
const DataTableHead = ({ colNames }) => (
  <TableHead>
    <TableRow>
      {colNames.map((item, index) => <StyledTableCell key={index}>{item}</StyledTableCell>)}
    </TableRow>
  </TableHead>
)

export default DataTableHead