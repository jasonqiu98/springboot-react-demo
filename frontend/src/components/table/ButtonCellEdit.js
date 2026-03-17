import React from 'react'
import { styled } from '@mui/material/styles'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import Button from '@mui/material/Button'

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
 * A pair of buttons "submit" and "edit" in the add and edit modes
 */
const ButtonCellEdit = ({ disabledSubmit, onSubmit, onCancel }) => (
  <TableCell sx={{ display: 'flex' }}>
    <Button size="small" variant="outlined" disabled={disabledSubmit} onClick={(event) => onSubmit(event)}>SUBMIT</Button>
    &emsp;
    <Button size="small" variant="outlined" onClick={onCancel}>CANCEL</Button>
  </TableCell>
)

export default ButtonCellEdit