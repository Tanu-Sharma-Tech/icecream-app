import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../api/axiosInstance'

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/auth/login', credentials)
      localStorage.setItem('accessToken', res.data.accessToken)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed')
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/auth/register', userData)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed')
    }
  }
)

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/auth/verify-otp', data)
      localStorage.setItem('accessToken', res.data.accessToken)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'OTP verification failed')
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/auth/logout')
      localStorage.removeItem('accessToken')
    } catch (err) {
      return rejectWithValue(err.response?.data?.message)
    }
  }
)

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/auth/me')
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:      null,
    token:     localStorage.getItem('accessToken') || null,
    userId:    null,
    isLoading: false,
    error:     null,
  },
  reducers: {
    clearError:  (state) => { state.error = null },
    setUserId:   (state, action) => { state.userId = action.payload },
    clearAuth:   (state) => {
      state.user  = null
      state.token = null
      localStorage.removeItem('accessToken')
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending,  (state) => { state.isLoading = true;  state.error = null })
      .addCase(loginUser.fulfilled,(state, action) => {
        state.isLoading = false
        state.user  = action.payload.user
        state.token = action.payload.accessToken
      })
      .addCase(loginUser.rejected, (state, action) => { state.isLoading = false; state.error = action.payload })

    // Register
    builder
      .addCase(registerUser.pending,  (state) => { state.isLoading = true;  state.error = null })
      .addCase(registerUser.fulfilled,(state, action) => {
        state.isLoading = false
        state.userId    = action.payload.userId
      })
      .addCase(registerUser.rejected, (state, action) => { state.isLoading = false; state.error = action.payload })

    // Verify OTP
    builder
      .addCase(verifyOTP.pending,   (state) => { state.isLoading = true;  state.error = null })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false
        state.user  = action.payload.user
        state.token = action.payload.accessToken
      })
      .addCase(verifyOTP.rejected,  (state, action) => { state.isLoading = false; state.error = action.payload })

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user  = null
        state.token = null
      })

    // Get Me
    builder
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload.user
      })
  }
})

export const { clearError, setUserId, clearAuth } = authSlice.actions
export default authSlice.reducer