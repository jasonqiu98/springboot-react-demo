/**
 * Copied from https://mui.com/material-ui/react-dialog/#delete-draggable-dialog
 */

import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Paper from '@mui/material/Paper'
import Draggable from 'react-draggable'
import useDebounce from '../hooks/useDebounce'
import { useDispatch, useSelector } from 'react-redux'
import { disable, enable, selectDisabled } from '../redux/disableDeleteSlice'
import { selectRoles } from '../redux/usernameRolesSlice'

const PaperComponent = (props) => {
  return (
    <Draggable
      handle="#delete-draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  )
}

const DeleteDraggableDialog = ({ onDelete, firstName, lastName, email }) => {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const disableDelete = useSelector(selectDisabled)
  const roles = useSelector(selectRoles)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleCloseCancel = () => {
    setOpen(false)
  }

  const deleteRecord = useDebounce(() => {
    onDelete()
    dispatch(enable())
  }, 500)

  const handleCloseDelete = () => {
    setOpen(false)
    dispatch(disable())  // temporarily disable all delete buttons
    deleteRecord()
  }

  return (
    <div>
      <Button
        size="small"
        variant="outlined"
        color="error"
        onClick={handleClickOpen}
        disabled={!roles.includes("admin") || disableDelete}
      >
        DELETE
      </Button>
      <Dialog
        open={open}
        // onClose={handleCloseCancel}
        PaperComponent={PaperComponent}
        aria-labelledby="delete-draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="delete-draggable-dialog-title">
          {`Delete ${firstName} ${lastName} at ${email}?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Once deleted, this record cannot be retrieved any more.`}

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancel}>Cancel</Button>
          <Button onClick={handleCloseDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default DeleteDraggableDialog
