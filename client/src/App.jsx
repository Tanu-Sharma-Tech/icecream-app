import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getMe } from './features/auth/authSlice'
import ProtectedRoute from './components/ProtectedRoute'
import ForgotPassword from './pages/ForgotPassword'
import VendorPanel from './pages/vendor/VendorPanel'
import SplashLoader   from './components/SplashLoader'
import ScrollToTop from './components/ScrollToTop'

// Pages
import Home          from './pages/Home'
import Shop          from './pages/Shop'
import Cart          from './pages/Cart'
import Auth          from './pages/Auth'
import Orders        from './pages/Orders'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProfileSettings from './pages/ProfileSettings'
import ProductDetail from './pages/ProductDetail'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) dispatch(getMe())
  }, [dispatch])

  const handleIntroComplete = () => {
    setLoading(false)
  }

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <SplashLoader key="loader" onComplete={handleIntroComplete} />
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
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
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login"    element={<Auth />} />
              <Route path="/register" element={<Auth />} />

              {/* Protected routes */}
              <Route path="/cart"   element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />

              {/* Admin routes */}
              <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />

              {/* Vendor routes */}
              <Route path="/vendor" element={<ProtectedRoute><VendorPanel /></ProtectedRoute>} />

              {/* Forgot Password route */}
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
            <ScrollToTop />
          </Router>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default App