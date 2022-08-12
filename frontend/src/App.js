/**
 * Modified from https://mui.com/material-ui/react-app-bar/
 * A Responsive App bar with Drawer
 */

import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { AppBar, Box, Button, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import MyAccount from './utils/MyAccount'

const drawerWidth = 240

const navItems = ["Home", "About"]

const routerMap = {
  "Home": "/",
  "About": "/about",
}

const App = (props) => {
  const navigate = useNavigate();
  const { window } = props
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Client List
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }} onClick={() => navigate(routerMap[item])}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  const container = window !== undefined ? () => window().document.body : undefined

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <AppBar component="nav">
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
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
          <MyAccount logoutNavigation="/logout" />
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}>
          {drawer}
        </Drawer>
      </Box>
      <Outlet />
    </Box>
  )
}

export default App