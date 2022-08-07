import { Box, Toolbar, Typography } from '@mui/material'
import React from 'react'


const About = () => {
  return (
    <Box component="main" sx={{ p: 6, width: 0.75 }}>
      <Toolbar />
      <Typography>
        This is a client list demo developed by <a href="https://github.com/jasonqiu98">Jason Qiu</a> using the React JavaScript library.
      </Typography>
    </Box >
  )
}

export default About