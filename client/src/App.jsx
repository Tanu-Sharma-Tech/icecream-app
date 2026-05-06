import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getMe } from './features/auth/authSlice'
import ProtectedRoute from './components/ProtectedRoute'
import ForgotPassword from './pages/ForgotPassword'
import VendorPanel from './pages/vendor/VendorPanel'
import ScrollToTop from './components/ScrollToTop'

// Pages — we will create these in next steps
import Home          from './pages/Home'
import Shop          from './pages/Shop'
import Cart          from './pages/Cart'
import Login         from './pages/Login'
import Register      from './pages/Register'
import Orders        from './pages/Orders'
import AdminDashboard from './pages/admin/AdminDashboard'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) dispatch(getMe())
  }, [dispatch])

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1F2937',
            color:      '#fff',
            borderRadius: '12px',
          },
        }}
      />
      <Routes>
        
        {/* Public routes */}
        <Route path="/"         element={<Home />} />
        <Route path="/shop"     element={<Shop />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route path="/cart"   element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />

          {/* Vendor routes */}
          <Route path="/vendor" element={<ProtectedRoute><VendorPanel /></ProtectedRoute>} />

        {/* Forgot Password route */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
      <ScrollToTop />
    </Router>
  )
}

export default App