import { configureStore } from '@reduxjs/toolkit'
import loginReducer from '../features/login/login_slice'
import userReducer from '../features/login/user_slice'

var _ = require('lodash')

const store = configureStore({
  reducer: {
    login: loginReducer,
    user: userReducer
  }
})



store.subscribe(
  _.throttle(() => {
    const token = store.getState().login.token
    if (token) {
      localStorage.setItem('token', JSON.stringify(token))
    }
  }, 1000)
)

export default store
