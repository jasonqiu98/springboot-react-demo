import React, { useCallback, useEffect, useState } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

import { Button, Toolbar, Typography, CircularProgress, Box } from '@mui/material'

import TablePaginationActions from '../utils/TablePaginationActions'
import DeleteDraggableDialog from '../utils/DeleteDraggableDialog'
import { BACKEND_URL } from '../utils/validation'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login, selectRoles, selectSignIn, selectUsername, setUsernameRoles } from '../redux/usernameRolesSlice'
import Login from './Login'
import axios from 'axios'
import { selectJwt, setJwt } from '../redux/jwtSlice'
import useDebounce from '../hooks/useDebounce'
import {
  DataTableHead,
  DataTableRowDisplay,
  DataTableRowInEditMode,
  DataTableRowInAddMode,
  PaginationFooter
} from '../components/table'

const createData = (id, firstName, lastName, email, gender) => {
  return { id, firstName, lastName, email, gender }
}

/**
 * Generated mock data from https://www.mockaroo.com/
 */

// const rows = [
//   createData(1, 'Clyde', 'Burris', 'cburris0@mapquest.com', 'M'),
//   createData(2, 'Aline', 'Abela', 'aabela1@php.net', 'F'),
//   createData(3, 'Deina', 'Potte', 'dpotte2@flickr.com', 'F'),
//   createData(4, 'Malia', 'McGreil', 'mmcgreil3@hibu.com', 'F'),
//   createData(5, 'Terence', 'Crampin', 'tcrampin4@tripod.com', 'M'),
//   createData(6, 'Karissa', 'MacElane', 'kmacelane5@guardian.co.uk', 'F'),
//   createData(7, 'Margi', 'Newby', 'mnewby6@harvard.edu', 'O'),
//   createData(8, 'Dom', 'Sinclair', 'dsinclair7@g.co', 'M'),
//   createData(9, 'Gordie', 'Sperling', 'gsperling8@biblegateway.com', 'M'),
//   createData(10, 'Elysha', 'Shillum', 'eshillum9@prweb.com', 'F'),
//   createData(11, 'Benton', 'Slator', 'bslatora@so-net.ne.jp', 'M'),
//   createData(12, 'Clare', 'Rigts', 'crigtsb@elpais.com', 'M'),
//   createData(13, 'Winnie', 'Ramsdell', 'wramsdellc@bloomberg.com', 'F'),
//   createData(14, 'Dionne', 'Lomasna', 'dlomasnad@posterous.com', 'O'),
//   createData(15, 'Adorne', 'Goundrill', 'agoundrille@nih.gov', 'F'),
//   createData(16, 'Cesare', 'MacAnespie', 'cmacanespief@nasa.gov', 'M'),
//   createData(17, 'Leodora', 'Thatcham', 'lthatchamg@prnewswire.com', 'F'),
//   createData(18, 'Ahmad', 'Simmings', 'asimmingsh@is.gd', 'M'),
//   createData(19, 'Cchaddie', 'Twigley', 'ctwigleyi@about.com', 'M'),
//   createData(20, 'Jacquelyn', 'Robbey', 'jrobbeyj@wikispaces.com', 'O'),
// ]

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
 * The main component of the client list
 * including a button of 'Add Clients'
 * and a table to display the clients' info
 */
const ClientList = () => {
  const navigate = useNavigate()
  const username = useSelector(selectUsername)
  const roles = useSelector(selectRoles)
  const signIn = useSelector(selectSignIn)
  const dispatch = useDispatch()
  const jwt = useSelector(selectJwt)

  useEffect(() => {
    if (roles.length === 0 && localStorage.roles) {
      dispatch(setUsernameRoles({
        username: localStorage.username,
        roles: JSON.parse(localStorage.roles),
      }))
      localStorage.removeItem("username")
      localStorage.removeItem("roles")

      if (localStorage.signIn === "true") {
        dispatch(login())
      }
      localStorage.removeItem("signIn")

      dispatch(setJwt(localStorage.jwt))
      localStorage.removeItem("jwt")
    } else {
      if (signIn) {
        let listener = (event) => {
          event.preventDefault()
          localStorage.username = username
          localStorage.roles = JSON.stringify(roles)
          localStorage.signIn = signIn.toString()
          localStorage.jwt = jwt
        }
        window.addEventListener('beforeunload', listener)
        // console.log(roles)
        return () => {
          window.removeEventListener('beforeunload', listener)
        }
      }
    }
  }, [dispatch, navigate, username, roles, signIn, jwt])

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
  const [dataLength, setDataLength] = useState(0)

  /**
   * select data on the current page
   */
  const getData = useCallback(() => {
    axios({
      url: "/clients/length",
      baseURL: BACKEND_URL,
      method: "get",
      headers: {
        "token": jwt,
      }
    }).then(res => setDataLength(res.data))
      .catch(err => console.log(err))
    /**
       * get request for data [Select/Read]
       * e.g. url: http://localhost:8091/clients/get/0/5
       */
    let requestUrl = rowsPerPage > 0
      ? ("/clients/get/" + (page * rowsPerPage) + "/" + rowsPerPage)
      : "/clients/get/"
    axios({
      url: requestUrl,
      baseURL: BACKEND_URL,
      method: "get",
      headers: {
        "token": jwt,
      }
    }).then(res => {
      setDataRows(res.data)
      setLoading(false)
    })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }, [jwt, page, rowsPerPage])

  useEffect(() => {
    if (signIn && (roles.includes('admin') || (roles.includes('user')))) {
      getData()
    }
  }, [signIn, getData, roles])

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataLength) : 0

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const enterEditMode = (localIdx) => {
    setIndexInEditMode(localIdx)
    setFirstNameInEditMode(dataRows[localIdx].firstName)
    setLastNameInEditMode(dataRows[localIdx].lastName)
    setEmailInEditMode(dataRows[localIdx].email)
    setGenderInEditMode(dataRows[localIdx].gender)
    setEditMode(true)
  }

  const exitEditMode = () => {
    setIndexInEditMode(-1)
    setEditMode(false)
  }

  const submitEdit = useDebounce((event) => {
    let row = {
      id: dataRows[indexInEditMode].id,
      firstName: firstNameInEditMode,
      lastName: lastNameInEditMode,
      email: emailInEditMode,
      gender: genderInEditMode,
    }
    event.preventDefault()
    axios({
      url: "/clients/update/" + row.id,
      baseURL: BACKEND_URL,
      method: "put",
      headers: {
        "token": jwt,
      },
      data: row
    }).then(dataRows[indexInEditMode] = row) // "seeming" update on the frontend
      .catch(err => console.log(err))
    exitEditMode()
  }, 100)

  const submitAddForm = (firstName, lastName, email, gender) => {
    let newClient = createData(dataLength + 1, firstName, lastName, email, gender)
    axios({
      url: "/clients/create",
      baseURL: BACKEND_URL,
      method: "post",
      headers: {
        "token": jwt,
      },
      data: newClient,
    }).then(getData())    // code 201, retrieve the data because the number of rows has changed
      .catch(err => console.log(err))
    setAddMode(false)
  }

  const deleteRow = (localIdx, indexToDelete) => {
    // delete row
    axios({
      url: "/clients/delete/" + indexToDelete,
      baseURL: BACKEND_URL,
      method: "delete",
      headers: {
        "token": jwt,
      }
    }).then(() => {
      if (localIdx === 0 && dataLength - 1 === page * rowsPerPage) {
        setPage(page > 1 ? page - 1 : 0)
      }
      getData()
    })
      .catch(err => console.log(err))
  }

  return (
    <Box component="main" sx={{ p: 5, width: 0.75 }}>
      <Toolbar />
      {/* Use `disableGutters` to remove the padding of Toolbar */}
      {signIn && !loading
        && (roles.includes("admin") || roles.includes("user"))
        && (
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1 }} />
            <Button variant="contained" onClick={() => { setAddMode(true) }}>
              Add Clients
            </Button>
          </Toolbar>
        )}
      {signIn && !loading
        && (roles.includes("admin") || roles.includes("user"))
        && dataLength === 0
        && (<Toolbar disableGutters>
          <Typography>
            The client list is empty.
          </Typography>
        </Toolbar>)}
      {!signIn
        ? (<Login />)
        : loading
          ? (<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading...</Typography>
          </Box>)
          : (roles.includes("admin") || roles.includes("user"))
            ? (<TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <DataTableHead colNames={["First Name", "Last Name", "Email", "Gender", "Actions"]} />
                <TableBody>
                  {addMode
                    && <DataTableRowInAddMode
                      onSubmit={(firstName, lastName, email, gender) => submitAddForm(firstName, lastName, email, gender)}
                      onCancel={() => { setAddMode(false) }}
                    />}
                  {dataRows.map((row, localIdx) => (editMode
                    // Don't change localIdx here!
                    // as they control and ensure local display 
                    ? <DataTableRowInEditMode
                      key={localIdx}
                      row={row}
                      index={localIdx}
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
                      onEdit={() => enterEditMode(localIdx)}
                      onDelete={() => deleteRow(localIdx, row.id)}
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
                  dataLength={dataLength}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  handleChangePage={handleChangePage}
                  handleChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </Table>
            </TableContainer>
            )
            : (
              <Typography>
                Hello Client! Welcome to our Client List!
              </Typography>
            )}

    </Box>
  )
}

export default ClientList