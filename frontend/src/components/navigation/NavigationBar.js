import React from 'react'
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'
import MyAccount from '../../utils/MyAccount'

const navItems = ["Home", "About"]

const routerMap = {
  "Home": "/",
  "About": "/about",
}

const NavigationBar = ({ navigate }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <AppBar component="nav" elevation={0}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
            {/* Use sx={{ textTransform: 'none' }} to remove capitalization of Button */}
            <Button sx={{ color: '#fff', textTransform: 'none' }} onClick={() => navigate("/")}>
              <Typography variant="h6" component="div" >
                Client List
              </Typography>
            </Button>
          </Box>
          {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
            Client List
          </Typography> */}
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button key={item} sx={{ color: '#fff' }} onClick={() => navigate(routerMap.hasOwnProperty(item) ? routerMap[item] : "*")}>
                {item}
              </Button>
            ))}
          </Box>
          <MyAccount logoutNavigation="/clients" />
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default NavigationBar