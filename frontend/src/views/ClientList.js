/**
 * Modifed from https://mui.com/material-ui/react-table
 * Customized table with Custom pagination actions
 */

import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import regEmail from '../utils/regEmail'

import { Button, createTheme, Input, MenuItem, TableFooter, TablePagination, TextField, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'

import TablePaginationActions from '../utils/TablePaginationActions'
import { ThemeProvider } from '@emotion/react'
import DeleteDraggableDialog from '../utils/DeleteDraggableDialog'

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

const createData = (id, firstName, lastName, email, gender) => {
  return { id, firstName, lastName, email, gender }
}

/**
 * Generated mock data from https://www.mockaroo.com/
 */

const rows = [
  createData(1, 'Clyde', 'Burris', 'cburris0@mapquest.com', 'M'),
  createData(2, 'Aline', 'Abela', 'aabela1@php.net', 'F'),
  createData(3, 'Deina', 'Potte', 'dpotte2@flickr.com', 'F'),
  createData(4, 'Malia', 'McGreil', 'mmcgreil3@hibu.com', 'F'),
  createData(5, 'Terence', 'Crampin', 'tcrampin4@tripod.com', 'M'),
  createData(6, 'Karissa', 'MacElane', 'kmacelane5@guardian.co.uk', 'F'),
  createData(7, 'Margi', 'Newby', 'mnewby6@harvard.edu', 'O'),
  createData(8, 'Dom', 'Sinclair', 'dsinclair7@g.co', 'M'),
  createData(9, 'Gordie', 'Sperling', 'gsperling8@biblegateway.com', 'M'),
  createData(10, 'Elysha', 'Shillum', 'eshillum9@prweb.com', 'F'),
  createData(11, 'Benton', 'Slator', 'bslatora@so-net.ne.jp', 'M'),
  createData(12, 'Clare', 'Rigts', 'crigtsb@elpais.com', 'M'),
  createData(13, 'Winnie', 'Ramsdell', 'wramsdellc@bloomberg.com', 'F'),
  createData(14, 'Dionne', 'Lomasna', 'dlomasnad@posterous.com', 'O'),
  createData(15, 'Adorne', 'Goundrill', 'agoundrille@nih.gov', 'F'),
  createData(16, 'Cesare', 'MacAnespie', 'cmacanespief@nasa.gov', 'M'),
  createData(17, 'Leodora', 'Thatcham', 'lthatchamg@prnewswire.com', 'F'),
  createData(18, 'Ahmad', 'Simmings', 'asimmingsh@is.gd', 'M'),
  createData(19, 'Cchaddie', 'Twigley', 'ctwigleyi@about.com', 'M'),
  createData(20, 'Jacquelyn', 'Robbey', 'jrobbeyj@wikispaces.com', 'O'),
]

/**
 * A gender map that defines the available choices in the system
 */
const genderMap = {
  'M': 'Male',
  'F': 'Female',
  'O': 'Others',
}

/**
 * gender options from the gender map for the select text field to use
 */
const genderOptions = Object.entries(genderMap).map((item) => ({ "value": item[0], "label": item[1] }))

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

/**
 * A pair of buttons "submit" and "edit" in the add and edit modes
 */
const ButtonCellEdit = ({ disabledSubmit, onSubmit, onCancel }) => (
  <StyledTableCell sx={{ display: 'flex' }}>
    <Button size="small" variant="outlined" disabled={disabledSubmit} onClick={(event) => onSubmit(event)}>SUBMIT</Button>
    &emsp;
    <Button size="small" variant="outlined" onClick={onCancel}>CANCEL</Button>
  </StyledTableCell>
)

/**
 * In the edit mode, all other buttons in the display mode are disabled
 * to avoid operations of multiple rows
 */
const ButtonCellDisabled = () => (
  <StyledTableCell sx={{ display: 'flex' }}>
    <Button size="small" variant="outlined" disabled>EDIT</Button>
    &emsp;
    <Button size="small" variant="outlined" disabled>DELETE</Button>
  </StyledTableCell>
)

/**
 * input field in the edit mode
 * @param {String} id id of the input
 * @param {String} value value of the react hook
 * @param {React.Dispatch<React.SetStateAction<string>>} setValue the set method of the react hook
 * @param {Boolean} isEmail whether the input is an email address or not
 * @returns 
 */
const InputInEditMode = ({ id, value, setValue, isEmail, regEmail }) => {
  return (
    <Input
      id={id}
      inputProps={{ style: { fontSize: 14 } }}
      value={value}
      error={value === '' || (isEmail && !regEmail.test(value))}  // to avoid null or irregular input
      onChange={(event) => setValue(event.target.value)}
    />
  )
}

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
          <InputInEditMode id="email-edit-mode" value={emailInEditMode} setValue={setEmailInEditMode} isEmail={true} regEmail={regEmail} />
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
            emailInEditMode === '' || !regEmail.test(emailInEditMode) ||
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
        <InputInEditMode id="email-add-mode" value={email} setValue={setEmail} isEmail={true} regEmail={regEmail}/>
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
          email === '' || !regEmail.test(email) ||
          gender === ''
        }
        onSubmit={() => onSubmit(firstName, lastName, email, gender)}
        onCancel={onCancel}
      />
    </StyledTableRow>
  )
}

/**
 * The pagination footer, borrowed from MUI
 */
const PaginationFooter = ({ editMode, dataRows, rowsPerPage, page, handleChangePage, handleChangeRowsPerPage }) => (
  <TableFooter>
    <TableRow>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
        colSpan={3}
        count={dataRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        SelectProps={{
          inputProps: {
            'aria-label': 'rows per page',
          },
          native: true,
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        // page changes are prohibited in the edit mode
        ActionsComponent={(subProps) => <TablePaginationActions {...subProps} editMode={editMode} />}
      />
    </TableRow>
  </TableFooter>
)

/**
 * The main component of the client list
 * including a button of 'Add Clients'
 * and a table to display the clients' info
 */
const ClientList = () => {
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [editMode, setEditMode] = useState(false)
  const [addMode, setAddMode] = useState(false)
  const [indexInEditMode, setIndexInEditMode] = useState(-1)
  const [firstNameInEditMode, setFirstNameInEditMode] = useState("")
  const [lastNameInEditMode, setLastNameInEditMode] = useState("")
  const [emailInEditMode, setEmailInEditMode] = useState("")
  const [genderInEditMode, setGenderInEditMode] = useState("")
  const [dataRows, setDataRows] = useState([])

  useEffect(() => {
    setDataRows(rows)
    setLoading(false)
  }, [])

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataRows.length) : 0

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const enterEditMode = (index) => {
    setIndexInEditMode(index)
    setFirstNameInEditMode(dataRows[index].firstName)
    setLastNameInEditMode(dataRows[index].lastName)
    setEmailInEditMode(dataRows[index].email)
    setGenderInEditMode(dataRows[index].gender)
    setEditMode(true)
  }

  const exitEditMode = () => {
    setIndexInEditMode(-1)
    setEditMode(false)
  }

  const submitEdit = (event) => {
    let editedDataRow = {
      firstName: firstNameInEditMode,
      lastName: lastNameInEditMode,
      email: emailInEditMode,
      gender: genderInEditMode,
    }
    dataRows[indexInEditMode] = editedDataRow
    event.preventDefault()
    setDataRows(dataRows)
    exitEditMode()
  }

  const submitAddForm = (firstName, lastName, email, gender) => {
    setDataRows([...dataRows, createData(dataRows.length + 1, firstName, lastName, email, gender)])
    setAddMode(false)
  }

  const deleteRow = (localIdx, indexToDelete) => {
    let newDataRows = dataRows.filter((item, index) => index !== indexToDelete)
    if (localIdx === 0 && indexToDelete === dataRows.length - 1) {
      if (indexToDelete > 0) {
        setPage(page - 1)
      } else {
        setPage(0)
      }
    }
    setDataRows(newDataRows)
  }

  return (
    <Box component="main" sx={{ p: 5, width: 0.75 }}>
      <Toolbar />
      {/* Use `disableGutters` to remove the padding of Toolbar */}
      <Toolbar disableGutters>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="contained" onClick={() => { setAddMode(true) }}>
          Add Clients
        </Button>
      </Toolbar>
      {!loading && dataRows.length === 0
        && (<Toolbar disableGutters>
          <Typography>
            The client list is empty.
          </Typography>
        </Toolbar>)}
      {loading
        ? (<Typography>
          Loading...
        </Typography>)
        : (<TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <DataTableHead colNames={["First Name", "Last Name", "Email", "Gender", "Actions"]} />
            <TableBody>
              {addMode
                && <DataTableRowInAddMode
                  onSubmit={(firstName, lastName, email, gender) => submitAddForm(firstName, lastName, email, gender)}
                  onCancel={() => { setAddMode(false) }}
                />}
              {(rowsPerPage > 0
                ? dataRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : dataRows
              ).map((row, localIdx) => (editMode
                ? <DataTableRowInEditMode
                  key={localIdx}
                  row={row}
                  index={page * rowsPerPage + localIdx}
                  indexInEditMode={indexInEditMode}
                  firstNameInEditMode={firstNameInEditMode}
                  setFirstNameInEditMode={setFirstNameInEditMode}
                  lastNameInEditMode={lastNameInEditMode}
                  setLastNameInEditMode={setLastNameInEditMode}
                  emailInEditMode={emailInEditMode}
                  setEmailInEditMode={setEmailInEditMode}
                  genderInEditMode={genderInEditMode}
                  setGenderInEditMode={setGenderInEditMode}
                  onSubmit={submitEdit}
                  onCancel={exitEditMode}
                />
                : <DataTableRowDisplay
                  key={localIdx}
                  row={row}
                  onEdit={() => enterEditMode(page * rowsPerPage + localIdx)}
                  onDelete={() => deleteRow(localIdx, page * rowsPerPage + localIdx)}
                />
              ))}

              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <PaginationFooter
              editMode={editMode}
              dataRows={dataRows}
              rowsPerPage={rowsPerPage}
              page={page}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Table>
        </TableContainer>
        )}

    </Box>
  )
}

export default ClientList