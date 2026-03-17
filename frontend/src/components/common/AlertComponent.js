import React from 'react'
import { Alert, AlertTitle, Collapse } from '@mui/material'

const AlertComponent = ({ severity, title, text, open, onClose }) => (
  <Collapse in={open}>
    <Alert severity={severity} onClose={onClose}>
      <AlertTitle>{title}</AlertTitle>
      {text}
    </Alert>
  </Collapse>
)

export default AlertComponent