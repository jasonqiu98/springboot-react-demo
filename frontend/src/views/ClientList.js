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

import { Button, Input, TableFooter, TablePagination, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'

import TablePaginationActions from '../utils/TablePaginationActions'

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

const createData = (id, name, email) => {
  return { id, name, email }
}

const rows = [
  createData(1, 'Alan', 'alanclarkson@hello.com'),
  createData(2, 'Alann', 'alanclarkson@hello.com'),
  createData(3, 'Alannn', 'alanclarkson@hello.com'),
  createData(4, 'Alannnn', 'alanclarkson@hello.com'),
  createData(5, 'Alannnnn', 'alanclarkson@hello.com'),
  createData(6, 'Alannnnnn', 'alanclarkson@hello.com'),
  createData(7, 'Albn', 'alanclarkson@hello.com'),
  createData(8, 'Albnn', 'alanclarkson@hello.com'),
  createData(9, 'Albnnn', 'alanclarkson@hello.com'),
  createData(10, 'Albnnnn', 'alanclarkson@hello.com'),
  createData(11, 'Albnnnnn', 'alanclarkson@hello.com'),
  createData(12, 'Albnnnnnn', 'alanclarkson@hello.com'),
]

const DataTableHead = ({ colNames }) => (
  <TableHead>
    <TableRow>
      {colNames.map((item, index) => <StyledTableCell key={index}>{item}</StyledTableCell>)}
    </TableRow>
  </TableHead>
)

const DataTableRowDisplay = ({ row, onEdit, onDelete }) => (
  <StyledTableRow>
    <StyledTableCell component="th" scope="row">{row.name}</StyledTableCell>
    <StyledTableCell>{row.email}</StyledTableCell>
    <StyledTableCell sx={{ display: 'flex' }}>
      <Button size="small" variant="outlined" onClick={onEdit}>EDIT</Button>
      &emsp;
      <Button size="small" variant="outlined" color="error" onClick={onDelete}>DELETE</Button>
    </StyledTableCell>
  </StyledTableRow>
)

const ButtonCellEdit = ({ onSubmit, onCancel }) => (
  <StyledTableCell sx={{ display: 'flex' }}>
    <Button size="small" variant="outlined" onClick={onSubmit}>SUBMIT</Button>
    &emsp;
    <Button size="small" variant="outlined" onClick={onCancel}>CANCEL</Button>
  </StyledTableCell>
)

const ButtonCellDisabled = () => (
  <StyledTableCell sx={{ display: 'flex' }}>
    <Button size="small" variant="outlined" disabled>EDIT</Button>
    &emsp;
    <Button size="small" variant="outlined" disabled>DELETE</Button>
  </StyledTableCell>
)

const DataTableRowInEditMode = (props) => {
  const { row, index, indexInEditMode, nameInEditMode, setNameInEditMode, emailInEditMode, setEmailInEditMode, onSubmit, onCancel } = props
  return (
    index === indexInEditMode
      ? (<StyledTableRow>
        <StyledTableCell component="th" scope="row">
          <Input
            id="name-edit-mode"
            inputProps={{ style: { fontSize: 14 } }}
            value={nameInEditMode}
            onChange={(event) => setNameInEditMode(event.target.value)}
          />
        </StyledTableCell>
        <StyledTableCell>
          <Input
            id="email-edit-mode"
            inputProps={{ style: { fontSize: 14 } }}
            value={emailInEditMode}
            onChange={(event) => setEmailInEditMode(event.target.value)}
          />
        </StyledTableCell>
        <ButtonCellEdit onSubmit={onSubmit} onCancel={onCancel} />
      </StyledTableRow>)
      : (<StyledTableRow>
        <StyledTableCell component="th" scope="row">{row.name}</StyledTableCell>
        <StyledTableCell>{row.email}</StyledTableCell>
        <ButtonCellDisabled />
      </StyledTableRow>)
  )
}

const DataTableRowInAddMode = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  return (
    <StyledTableRow>
      <StyledTableCell component="th" scope="row">
        <Input
          id="name-add-mode"
          inputProps={{ style: { fontSize: 14 } }}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </StyledTableCell>
      <StyledTableCell>
        <Input
          id="email-add-mode"
          inputProps={{ style: { fontSize: 14 } }}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </StyledTableCell>
      <ButtonCellEdit onSubmit={() => onSubmit(name, email)} onCancel={onCancel} />
    </StyledTableRow>
  )
}

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
        ActionsComponent={(subProps) => <TablePaginationActions {...subProps} editMode={editMode} />}
      />
    </TableRow>
  </TableFooter>
)

const ClientList = () => {
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [editMode, setEditMode] = useState(false)
  const [addMode, setAddMode] = useState(false)
  const [indexInEditMode, setIndexInEditMode] = useState(-1)
  const [nameInEditMode, setNameInEditMode] = useState("")
  const [emailInEditMode, setEmailInEditMode] = useState("")
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
    setNameInEditMode(dataRows[index].name)
    setEmailInEditMode(dataRows[index].email)
    setEditMode(true)
  }

  const exitEditMode = () => {
    setIndexInEditMode(-1)
    setEditMode(false)
  }

  const submitEdit = () => {
    dataRows[indexInEditMode].name = nameInEditMode
    dataRows[indexInEditMode].email = emailInEditMode
    setDataRows(dataRows)
    exitEditMode()
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

  const submitAddForm = (name, email) => {
    setDataRows([...dataRows, createData(dataRows.length + 1, name, email)])
    setAddMode(false)
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
            <DataTableHead colNames={["Name", "Email", "Actions"]} />
            <TableBody>
              {addMode
                && <DataTableRowInAddMode
                  onSubmit={(name, email) => submitAddForm(name, email)}
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
                  nameInEditMode={nameInEditMode}
                  setNameInEditMode={setNameInEditMode}
                  emailInEditMode={emailInEditMode}
                  setEmailInEditMode={setEmailInEditMode}
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