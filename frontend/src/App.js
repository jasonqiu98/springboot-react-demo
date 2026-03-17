import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Box } from '@mui/material'
import { NavigationBar, NavigationDrawer } from './components/navigation'

const App = (props) => {
  const navigate = useNavigate();
  const { window } = props
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <NavigationBar navigate={navigate} />
      <NavigationDrawer
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        navigate={navigate}
        window={window}
      />
      <Outlet />
    </Box>
  )
}

export default App