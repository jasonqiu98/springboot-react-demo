import React from 'react'
import Input from '@mui/material/Input'
import { validEmail } from '../../utils/validation'

/**
 * input field in the edit mode
 * @param {String} id id of the input
 * @param {String} value value of the react hook
 * @param {React.Dispatch<React.SetStateAction<string>>} setValue the set method of the react hook
 * @param {Boolean} isEmail whether the input is an email address or not
 * @returns
 */
const InputInEditMode = ({ id, value, setValue, isEmail }) => {
  return (
    <Input
      id={id}
      inputProps={{ style: { fontSize: 14 } }}
      value={value}
      error={value === '' || (isEmail && !validEmail(value))}  // to avoid null or irregular input
      onChange={(event) => setValue(event.target.value)}
    />
  )
}

export default InputInEditMode