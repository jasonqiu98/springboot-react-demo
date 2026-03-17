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
 * In the edit mode, all other buttons in the display mode are disabled
 * to avoid operations of multiple rows
 */
const ButtonCellDisabled = () => (
  <TableCell sx={{ display: 'flex' }}>
    <Button size="small" variant="outlined" disabled>EDIT</Button>
    &emsp;
    <Button size="small" variant="outlined" disabled>DELETE</Button>
  </TableCell>
)

export default ButtonCellDisabled