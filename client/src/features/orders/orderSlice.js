import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../api/axiosInstance'

export const placeOrder = createAsyncThunk(
  'orders/place',
  async (orderData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/orders', orderData)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Order failed')
    }
  }
)

export const getMyOrders = createAsyncThunk(
  'orders/getMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/orders/my-orders')
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message)
    }
  }
)

export const cancelOrder = createAsyncThunk(
  'orders/cancel',
  async ({ orderId, reason }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/orders/${orderId}/cancel`, { reason })
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Cancellation failed')
    }
  }
)

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders:       [],
    currentOrder: null,
    isLoading:    false,
    error:        null,
  },
  reducers: {
    clearCurrentOrder: (state) => { state.currentOrder = null },
    clearError:        (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending,   (state) => { state.isLoading = true })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.isLoading    = false
        state.currentOrder = action.payload.order
      })
      .addCase(placeOrder.rejected,  (state, action) => {
        state.isLoading = false
        state.error     = action.payload
      })

    builder
      .addCase(getMyOrders.pending,   (state) => { state.isLoading = true })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.isLoading = false
        state.orders    = action.payload.orders
      })
      .addCase(getMyOrders.rejected,  (state, action) => {
        state.isLoading = false
        state.error     = action.payload
      })

    builder
      .addCase(cancelOrder.pending, (state) => { state.isLoading = true })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.orders.findIndex(o => o._id === action.payload.order._id)
        if (index !== -1) state.orders[index] = action.payload.order
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false
        state.error     = action.payload
      })
  }
})

export const { clearCurrentOrder, clearError } = orderSlice.actions
export default orderSlice.reducer