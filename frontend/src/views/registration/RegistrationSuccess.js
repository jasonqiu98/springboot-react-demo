import React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'

const theme = createTheme()

const RegistrationSuccess = () => {
  const { state: { message } } = useLocation()
  const navigate = useNavigate()
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography>
            {message}
          </Typography>
        </Box>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={() => navigate("/clients", { replace: true })}
        >
          To Login Page
        </Button>
      </Container>
    </ThemeProvider>
  )
}

export default RegistrationSuccess