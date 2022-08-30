import { createSlice } from "@reduxjs/toolkit"

export const usernameRolesSlice = createSlice({
  name: 'jwt',
  initialState: {
    username: '',
    roles: [],
    signIn: false
  },
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload
    },
    setRoles: (state, action) => {
      state.roles = action.payload
    },
    setUsernameRoles: (state, action) => {
      state.username = action.payload.username
      state.roles = action.payload.roles
    },
    login: (state) => {
      state.signIn = true
    },
    logout: (state) => {
      state.signIn = false
    }
  }
})

// actions
export const { setUsername, setRoles, setUsernameRoles, login, logout } = usernameRolesSlice.actions
// selectors
export const selectUsername = (state) => state.usernameRoles.username
export const selectRoles = (state) => state.usernameRoles.roles
export const selectSignIn = (state) => state.usernameRoles.signIn

export default usernameRolesSlice.reducer