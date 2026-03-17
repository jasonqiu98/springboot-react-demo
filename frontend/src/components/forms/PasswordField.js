import React from 'react'
import { TextField, FormControlLabel, Checkbox, Grid } from '@mui/material'

const PasswordField = ({
  id,
  label,
  value,
  onChange,
  showPassword,
  onShowPasswordChange,
  showPasswordLabel = "Show Password"
}) => (
  <>
    <TextField
      margin="normal"
      required
      fullWidth
      name="password"
      label={label}
      type={showPassword ? "text" : "password"}
      id={id}
      autoComplete="current-password"
      value={value}
      onChange={onChange}
    />
    <Grid item xs={12}>
      <FormControlLabel
        control={<Checkbox
          checked={showPassword}
          onChange={onShowPasswordChange}
          color="primary" />}
        label={showPasswordLabel}
      />
    </Grid>
  </>
)

export default PasswordField