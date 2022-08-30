import { createSlice } from "@reduxjs/toolkit"

export const jwtSlice = createSlice({
  name: 'jwt',
  initialState: {
    token: null
  },
  reducers: {
    setJwt: (state, action) => {
      state.token = action.payload
    },
    clear: (state) => {
      state.token = null
    }
  }
})

// actions
export const { setJwt, clear } = jwtSlice.actions

// selectors
export const selectJwt = (state) => state.jwt.token

export default jwtSlice.reducer