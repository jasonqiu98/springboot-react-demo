import React from 'react'
import { styled } from '@mui/material/styles'
import TableRow from '@mui/material/TableRow'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import InputInEditMode from './InputInEditMode'
import ButtonCellEdit from './ButtonCellEdit'
import ButtonCellDisabled from './ButtonCellDisabled'
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
 * The form embedded within the table in the edit mode
 */
const DataTableRowInEditMode = (props) => {
  const { row, index, indexInEditMode,
    firstNameInEditMode, setFirstNameInEditMode,
    lastNameInEditMode, setLastNameInEditMode,
    emailInEditMode, setEmailInEditMode,
    genderInEditMode, setGenderInEditMode,
    onSubmit, onCancel } = props

  return (
    index === indexInEditMode
      ? (<StyledTableRow>
        <StyledTableCell component="th" scope="row">
          <InputInEditMode id="first-name-edit-mode" value={firstNameInEditMode} setValue={setFirstNameInEditMode} />
        </StyledTableCell>
        <StyledTableCell>
          <InputInEditMode id="last-name-edit-mode" value={lastNameInEditMode} setValue={setLastNameInEditMode} />
        </StyledTableCell>
        <StyledTableCell>
          <InputInEditMode id="email-edit-mode" value={emailInEditMode} setValue={setEmailInEditMode} isEmail={true} />
        </StyledTableCell>
        <StyledTableCell>
          <TextField
            id="gender-edit-mode"
            select
            value={genderInEditMode}
            error={genderInEditMode === ''}
            onChange={(event) => setGenderInEditMode(event.target.value)}
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
            firstNameInEditMode === '' ||
            lastNameInEditMode === '' ||
            !validEmail(emailInEditMode) ||
            genderInEditMode === ''
          }
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </StyledTableRow>)
      : (<StyledTableRow>
        <StyledTableCell component="th" scope="row">{row.firstName}</StyledTableCell>
        <StyledTableCell>{row.lastName}</StyledTableCell>
        <StyledTableCell>{row.email}</StyledTableCell>
        <StyledTableCell>{genderMap[row.gender]}</StyledTableCell>
        <ButtonCellDisabled />
      </StyledTableRow>)
  )
}

export default DataTableRowInEditMode