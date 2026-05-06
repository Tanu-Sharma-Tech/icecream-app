import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items:       JSON.parse(localStorage.getItem('cartItems')) || [],
    totalAmount: 0,
    totalItems:  0,
  },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(
        i => i._id === action.payload._id && i.size === action.payload.size
      )
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
      state.totalAmount = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      state.totalItems  = state.items.reduce((sum, i) => sum + i.quantity, 0)
      localStorage.setItem('cartItems', JSON.stringify(state.items))
    },

    removeFromCart: (state, action) => {
      state.items       = state.items.filter(i => i._id !== action.payload)
      state.totalAmount = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      state.totalItems  = state.items.reduce((sum, i) => sum + i.quantity, 0)
      localStorage.setItem('cartItems', JSON.stringify(state.items))
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find(i => i._id === id)
      if (item) {
        item.quantity = quantity
        if (item.quantity <= 0) {
          state.items = state.items.filter(i => i._id !== id)
        }
      }
      state.totalAmount = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      state.totalItems  = state.items.reduce((sum, i) => sum + i.quantity, 0)
      localStorage.setItem('cartItems', JSON.stringify(state.items))
    },

    clearCart: (state) => {
      state.items       = []
      state.totalAmount = 0
      state.totalItems  = 0
      localStorage.removeItem('cartItems')
    },
  }
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer