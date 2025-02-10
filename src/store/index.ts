import { configureStore } from '@reduxjs/toolkit'
import messageReducer from './secretSlice'

export const store = configureStore({
  reducer: {
    secret: messageReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
