import { ThemeProvider } from '@emotion/react'
import { Box, Button, Container, createTheme, CssBaseline, Typography } from '@mui/material'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const theme = createTheme()

const ResetPasswordSuccess = () => {
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

export default ResetPasswordSuccess