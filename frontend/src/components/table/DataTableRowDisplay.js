import React from 'react'
import { styled } from '@mui/material/styles'
import TableRow from '@mui/material/TableRow'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import Button from '@mui/material/Button'
import DeleteDraggableDialog from '../../utils/DeleteDraggableDialog'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

/**
 * A gender map that defines the available choices in the system
 */
const genderMap = {
  0: 'Female',
  1: 'Male',
  2: 'Others',
}

/**
 * A data row in the display mode
 */
const DataTableRowDisplay = ({ row, onEdit, onDelete }) => (
  <StyledTableRow>
    <StyledTableCell component="th" scope="row">{row.firstName}</StyledTableCell>
    <StyledTableCell>{row.lastName}</StyledTableCell>
    <StyledTableCell>{row.email}</StyledTableCell>
    <StyledTableCell>{genderMap[row.gender]}</StyledTableCell>
    <StyledTableCell sx={{ display: 'flex' }}>
      <Button size="small" variant="outlined" onClick={onEdit}>EDIT</Button>
      &emsp;
      <DeleteDraggableDialog onDelete={onDelete} {...row} />
    </StyledTableCell>
  </StyledTableRow>
)

export default DataTableRowDisplay