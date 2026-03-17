import React, { useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login, setUsernameRoles } from '../redux/usernameRolesSlice'
import { setJwt } from '../redux/jwtSlice'
import { BACKEND_URL } from '../utils/validation'
import axios from 'axios'
import { AlertComponent } from '../components/common'
import { PasswordField } from '../components/forms'

/**
 * -------------"client"-------------
 * username: client
 * password: helloworld
 * --------------"user"--------------
 * username: user
 * password: helloworld
 * -------------"admin"--------------
 * username: admin
 * password: helloworld
 */

const theme = createTheme()

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [alertSeverity, setAlertSeverity] = useState("success")
  const [alertTitle, setAlertTitle] = useState("Error")
  const [alertText, setAlertText] = useState("Account already exists")
  const [alertOpen, setAlertOpen] = useState(false)

  const constructAlert = (severity, title, text) => {
    setAlertSeverity(severity)
    setAlertTitle(title)
    setAlertText(text)
    setAlertOpen(true)
    // setTimeout(() => setAlertOpen(false), 5000)  // set a timer for five secs
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setLoading(true)
    axios({
      url: "/user/login",
      baseURL: BACKEND_URL,
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        username: username.trim(),
        password: password,
      }
    }).then(response => {
      setPassword("")
      dispatch(setJwt(response.headers.authorization))
      // use redux to manage common states: [username, role]
      let usernameRoles = {
        username: response.data.username,
        roles: response.data.authorities
      }
      dispatch(setUsernameRoles(usernameRoles))
      constructAlert("success", "Login Successful!", "You have successfully logged in.")
      dispatch(login())
      setLoading(false)
      // navigate to the client list page
      navigate("/clients", { replace: true })
    })
      .catch(() => {
        setPassword("")
        constructAlert("error", "Login Failed", "Please check your credentials.")
        setLoading(false)
      })
  }

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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              color={username !== "" ? "primary" : "error"}
              id="username"
              label="Username/Email"
              name="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
            />
            <PasswordField
              id="password"
              label="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              showPassword={showPassword}
              onShowPasswordChange={(e) => setShowPassword(e.target.checked)}
            />
            <Grid item xs={12}>
              <AlertComponent
                severity={alertSeverity}
                title={alertTitle}
                text={alertText}
                open={alertOpen}
                onClose={() => setAlertOpen(false)}
              />
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={username === "" || password === "" || loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>

            <Grid container>
              <Grid item xs>
                <Link href="/reset" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
      </Container>
    </ThemeProvider>
  )
}

export default Login
