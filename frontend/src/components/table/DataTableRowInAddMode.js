import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import TableRow from '@mui/material/TableRow'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import InputInEditMode from './InputInEditMode'
import ButtonCellEdit from './ButtonCellEdit'
import { validEmail } from '../../utils/validation'

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
 * gender options from the gender map for the select text field to use
 */
const genderOptions = Object.entries(genderMap).map((item) => ({ "value": item[0], "label": item[1] }))

/**
 * The form embedded within the table in the add mode
 */
const DataTableRowInAddMode = ({ onSubmit, onCancel }) => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [gender, setGender] = useState("")

  return (
    <StyledTableRow>
      <StyledTableCell component="th" scope="row">
        <InputInEditMode id="first-name-add-mode" value={firstName} setValue={setFirstName} />
      </StyledTableCell>
      <StyledTableCell>
        <InputInEditMode id="last-name-add-mode" value={lastName} setValue={setLastName} />
      </StyledTableCell>
      <StyledTableCell>
        <InputInEditMode id="email-add-mode" value={email} setValue={setEmail} isEmail={true} />
      </StyledTableCell>
      <StyledTableCell>
        <TextField
          id="gender-add-mode"
          select
          value={gender}
          error={gender === ''}
          onChange={(event) => setGender(event.target.value)}
          variant="standard"
          size="small"
        >
          {genderOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <ThemeProvider theme={createTheme({ typography: { fontSize: 12 } })}>
                <Typography>{option.label}</Typography>
              </ThemeProvider>
            </MenuItem>
          ))}
        </TextField>
      </StyledTableCell>
      <ButtonCellEdit
        // to avoid null input
        disabledSubmit={
          firstName === '' ||
          lastName === '' ||
          !validEmail(email) ||
          gender === ''
        }
        onSubmit={() => onSubmit(firstName, lastName, email, gender)}
        onCancel={onCancel}
      />
    </StyledTableRow>
  )
}

export default DataTableRowInAddMode