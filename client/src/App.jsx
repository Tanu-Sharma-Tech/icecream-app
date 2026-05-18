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
import Support       from './pages/Support'
import GlobalChat    from './components/GlobalChat'
import PageScrollManager from './components/PageScrollManager'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if there is a token in the URL (from Google OAuth)
    const params = new URLSearchParams(window.location.search)
    const urlToken = params.get('token')
    
    if (urlToken) {
      // Save token and remove it from URL bar to keep it clean
      localStorage.setItem('accessToken', urlToken)
      window.history.replaceState({}, document.title, window.location.pathname)
      dispatch(getMe())
    } else {
      // Normal flow
      const token = localStorage.getItem('accessToken')
      if (token) dispatch(getMe())
    }
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
                duration: 4000,
                style: {
                  background: '#ffffff',
                  color: '#111827',
                  borderRadius: '2rem',
                  padding: '16px 24px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                  fontWeight: '800',
                  border: '1px solid #f9fafb',
                  fontSize: '14px',
                  letterSpacing: '0.05em',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#ffffff',
                  },
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
              <Route path="/support"  element={<Support />} />

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
            <GlobalChat />
            <PageScrollManager />
          </Router>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default App