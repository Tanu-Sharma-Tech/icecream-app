import { configureStore } from '@reduxjs/toolkit'
import authReducer  from './auth/authSlice'
import cartReducer  from './cart/cartSlice'
import orderReducer from './orders/orderSlice'

export const store = configureStore({
  reducer: {
    auth:   authReducer,
    cart:   cartReducer,
    orders: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})