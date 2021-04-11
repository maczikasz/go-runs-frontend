import { createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'

const fetchSavedToken = () => {
  const savedToken = localStorage.getItem('token')
  if (savedToken != null) {
    const token = JSON.parse(savedToken)
    console.log(JSON.stringify(token))
    const expiry = dayjs(token.expiry)
    if (expiry.isAfter(dayjs().add(5, 'minute'))) {
      return token
    }
  }

  return null
}
const savedToken = fetchSavedToken()

export const loginSlice = createSlice({
  name: 'login',
  initialState: {
    token: savedToken
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload
    },
    unsetToken: state => {
      state.token = null
    }
  }
})

export const { setToken, unsetToken } = loginSlice.actions
export const selectToken = state => state.login.token

export default loginSlice.reducer
