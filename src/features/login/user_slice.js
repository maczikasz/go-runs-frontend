import { createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    info: null
  },
  reducers: {
    setUserinfo: (state, action) => {
      state.info = action.payload
    },
    unsetUserinfo: state => {
      state.info = null
    }
  }
})

export const { setUserinfo, unsetUserinfo } = userSlice.actions
export const selectUserinfo = state => state.user.info

export default userSlice.reducer
