/**
 * From https://mui.com/material-ui/getting-started/templates/sign-up/
 */

 import React, { useState } from 'react'
 import Avatar from '@mui/material/Avatar'
 import Button from '@mui/material/Button'
 import CssBaseline from '@mui/material/CssBaseline'
 import TextField from '@mui/material/TextField'
 import FormControlLabel from '@mui/material/FormControlLabel'
 import Checkbox from '@mui/material/Checkbox'
 import Link from '@mui/material/Link'
 import Grid from '@mui/material/Grid'
 import Box from '@mui/material/Box'
 import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
 import Typography from '@mui/material/Typography'
 import Container from '@mui/material/Container'
 import { createTheme, ThemeProvider } from '@mui/material/styles'
 import { RESEND_PERIOD, validEmail, validPassword } from '../../utils/validation'
 import axios from 'axios'
 import { Alert, AlertTitle, Collapse } from '@mui/material'
 import { useNavigate } from 'react-router-dom'
 
 const theme = createTheme()
 
 export default function Register() {
   const navigate = useNavigate()
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
   const [matchingPassword, setMatchingPassword] = useState("")
   const [showPassword, setShowPassword] = useState(false)
   const [codeSent, setCodeSent] = useState(false)
   const [code, setCode] = useState("")
   const [codeCount, setCodeCount] = useState(0)
   const [countDownStart, setCountDownStart] = useState(false)
   const [countDown, setCountDown] = useState(0)
   const [alertSeverity, setAlertSeverity] = useState("success")
   const [alertTitle, setAlertTitle] = useState("Error")
   const [alertText, setAlertText] = useState("Account already exists")
   const [alertOpen, setAlertOpen] = useState(false)
 
   /**
    * https://www.programminghunter.com/article/8839715896/ (content in Chinese)
    */
 
   const handleCountDown = (seconds = 60) => {
     setCountDown(seconds)
     setCountDownStart(true)
     let countDownTimer = () => {
       if (seconds > 0) {
         seconds--
         setCountDown(seconds)
       }
       if (seconds === 0) {
         setCountDownStart(false)
         return
       }
       setTimeout(countDownTimer, 1000)
     }
     setTimeout(countDownTimer, 1000)
   }
 
   const handleSubmit = (event) => {
 
     event.preventDefault()
     /**
      * ------------------------------------------------
      * security consideration
      * ------------------------------------------------
      */
     if (!validEmail(email)) {
       console.log("invalid email")
       return
     }
     if (!validPassword(password, matchingPassword)) {
       console.log("invalid password")
       return
     }
     /**
      * ------------------------------------------------
      * submit json data
      * ------------------------------------------------
      */
     let requestBody = {
       email: email.trim(),
       password: password,
       matchingPassword: matchingPassword,
       verificationCode: code.trim()
     }
 
     /**
      * sign up
      * success: navigate to the success page and display username
      * failure: construct an alert to show the reason
      */
 
     axios({
       url: "http://localhost:8091/reset/save",
       method: "post",
       headers: {
         "Content-Type": "application/json"
       },
       data: requestBody
     }).then(response => {
       navigate("/resetSuccess", {
         replace: true,
         state: {
           message: response.data
         }
       })
     }).catch(error => {
         if (error.code === "ERR_BAD_REQUEST") {
           constructAlert("error", "Error", error.response.data)
         }
       })
 
   }
 
   const constructAlert = (severity, title, text) => {
     setAlertSeverity(severity)
     setAlertTitle(title)
     setAlertText(text)
     setAlertOpen(true)
     // setTimeout(() => setAlertOpen(false), 5000)  // set a timer for five secs
   }
 
   const handleSendEmail = (email) => {
     /**
      * mock the process of sending an email
      * the token will display in the console of the backend
      * success: construct an alert to show the success
      * failure: construct an alert to show the reason
      */
     axios({
       url: "http://localhost:8091/reset/send",
       method: "post",
       headers: {
         "Content-Type": "application/json"
       },
       data: {
         email: email.trim()
       }
     }).then(response => constructAlert("success", "Success", response.data))
       .catch(error => {
         if (error.code === "ERR_BAD_REQUEST") {
           constructAlert("error", "Error", error.response.data)
         }
       })
   }
 
   const handleSend = () => {
     setCodeSent(true)
     setCodeCount(codeCount + 1)
     handleCountDown(RESEND_PERIOD)  // set a timer with the given seconds
     handleSendEmail(email)
   }
 
   const handleResend = () => {
     setCodeCount(codeCount + 1)
     handleCountDown(RESEND_PERIOD)  // set a timer with the given seconds
     handleSendEmail(email)
   }
 
   const formComplete = () => (
     validEmail(email) && validPassword(password, matchingPassword)
   )
 
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
             Reset Your Password
           </Typography>
           <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
             <Grid container spacing={2}>
               <Grid item xs={12}>
                 <TextField
                   required
                   fullWidth
                   color={validEmail(email) ? "primary" : "error"}
                   id="email"
                   label="Email Address"
                   name="email"
                   autoComplete="email"
                   value={email}
                   onChange={e => setEmail(e.target.value)}
                 />
               </Grid>
               <Grid item xs={12}>
                 <TextField
                   required
                   fullWidth
                   name="password"
                   label="Password"
                   color={validPassword(password, matchingPassword) ? "primary" : "error"}
                   type={showPassword ? "text" : "password"}
                   id="password"
                   autoComplete="new-password"
                   value={password}
                   onChange={e => setPassword(e.target.value)}
                 />
               </Grid>
               <Grid item xs={12}>
                 <TextField
                   required
                   fullWidth
                   name="matchingPassword"
                   label="Confirm Password"
                   color={validPassword(password, matchingPassword) ? "primary" : "error"}
                   type={showPassword ? "text" : "password"}
                   id="matchingPassword"
                   value={matchingPassword}
                   onChange={e => setMatchingPassword(e.target.value)}
                 />
               </Grid>
               <Grid item xs={12}>
                 <TextField
                   required
                   fullWidth
                   name="verificationCode"
                   label="Verification Code"
                   id="verificationCode"
                   value={code}
                   onChange={e => setCode(e.target.value)}
                   InputProps={{
                     // buttons and countdown
                     endAdornment: (
                       codeSent
                         ? (<Button
                           onClick={handleResend}
                           disabled={!formComplete() || codeCount >= 3 || countDownStart}
                         >resend{countDownStart && "(" + countDown + "s)"}</Button>)
                         : (<Button
                           onClick={handleSend}
                           disabled={!formComplete() || codeSent || countDownStart}
                         >send{countDownStart && "(" + countDown + "s)"}</Button>)
                     )
                   }}
                 />
               </Grid>
               <Grid item xs={12}>
                 <Collapse in={alertOpen}>
                   <Alert severity={alertSeverity} onClose={() => setAlertOpen(false)}>
                     <AlertTitle>{alertTitle}</AlertTitle>
                     {alertText}
                   </Alert>
                 </Collapse>
               </Grid>
               {/* <Grid item xs={12}>
                 <FormControlLabel
                   control={<Checkbox value="allowExtraEmails" color="primary" />}
                   label="I want to receive inspiration, marketing promotions and updates via email."
                 />
               </Grid> */}
               <Grid item xs={12}>
                 <FormControlLabel
                   control={<Checkbox
                     checked={showPassword}
                     onChange={(e) => setShowPassword(e.target.checked)}
                     color="primary" />}
                   label="Show Password"
                 />
               </Grid>
               <Grid item xs={12}>
                 <Typography>*Your password should include 8 to 20 (inclusive) characters.</Typography>
                 <Typography>*Please fill in your information before request your verification code.</Typography>
                 <Typography>*You can request a maximum of three verification codes within each hour.</Typography>
               </Grid>
             </Grid>
 
             <Button
               type="submit"
               fullWidth
               variant="contained"
               sx={{ mt: 3, mb: 2 }}
               disabled={!formComplete() || code === ""}
             >
               Save Password
             </Button>
 
             <Grid container justifyContent="flex-end">
               <Grid item>
                 <Link href="/clients" variant="body2">
                   Click here to sign in
                 </Link>
               </Grid>
             </Grid>
           </Box>
         </Box>
         {/* <Copyright sx={{ mt: 5 }} /> */}
       </Container>
     </ThemeProvider>
   )
 }
 