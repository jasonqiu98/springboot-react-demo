import { configureStore } from '@reduxjs/toolkit'
import usernameRolesReducer from './usernameRolesSlice'
import disableDeleteReducer from './disableDeleteSlice'
import jwtReducer from './jwtSlice'

const store = configureStore({
  reducer: {
    usernameRoles: usernameRolesReducer,
    disableDelete: disableDeleteReducer,
    jwt: jwtReducer,
  }
})

export default store