import { createSlice } from "@reduxjs/toolkit"

export const disableDeleteSlice = createSlice({
  name: 'disableDelete',
  initialState: {
    disabled: false
  },
  reducers: {
    disable: (state) => {
      state.disabled = true
    },
    enable: (state) => {
      state.disabled = false
    }
  }
})

// actions
export const { disable, enable } = disableDeleteSlice.actions
// selectors
export const selectDisabled = (state) => state.disableDelete.disabled

export default disableDeleteSlice.reducer