import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { loginUser, registerUser, verifyOTP, clearError } from '../features/auth/authSlice'

const Auth = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  // Determine initial mode from URL (e.g. /register or /login)
  const isRegisterInitial = location.pathname === '/register'
  const [mode, setMode] = useState(isRegisterInitial ? 'register' : 'login')
  const [step, setStep] = useState(1) // Only for register
  
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  })
  const [otp, setOtp] = useState('')

  const { isLoading, error, user, userId } = useSelector(state => state.auth)

  useEffect(() => {
    if (user) navigate('/')
  }, [user, navigate])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    
    if (mode === 'login') {
      if (!form.email || !form.password) return toast.error('Please fill all fields')
      dispatch(loginUser({ email: form.email, password: form.password })).then(res => {
        if (res.meta.requestStatus === 'fulfilled') {
          toast.success('Welcome back!')
          navigate('/')
        }
      })
    } else {
      // Register
      if (step === 1) {
        if (!form.name || !form.email || !form.password) return toast.error('Please fill all fields')
        if (form.password !== form.confirmPassword)       return toast.error('Passwords do not match')
        if (form.password.length < 6) return toast.error('Password must be at least 6 characters')

        dispatch(registerUser({
          name:     form.name,
          email:    form.email,
          password: form.password,
        })).then(res => {
          if (res.meta.requestStatus === 'fulfilled') {
            toast.success('OTP sent to your email!')
            if (res.payload?.devOtp) {
              toast.success(`TESTING OTP: ${res.payload.devOtp}`, { duration: 10000, icon: '🔧' })
            }
            setStep(2)
          }
        })
      } else {
        // Verify OTP
        if (!otp || otp.length !== 6) return toast.error('Please enter a valid 6-digit OTP')
        dispatch(verifyOTP({ userId, otp })).then(res => {
          if (res.meta.requestStatus === 'fulfilled') {
            toast.success('Account verified! Welcome')
            navigate('/')
          }
        })
      }
    }
  }

  const toggleMode = () => {
    const newMode = mode === 'login' ? 'register' : 'login'
    setMode(newMode)
    setStep(1)
    setForm({ name: '', email: '', password: '', confirmPassword: '' })
    navigate(newMode === 'login' ? '/login' : '/register')
  }

  return (
    <div className="min-h-screen bg-light flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-8 w-full max-w-md relative overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-hide"
      >
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12" />
        
        <div className="text-center mb-4 relative">
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-4xl mb-2 select-none"
          >
            🍦
          </motion.div>
          <h1 className="text-xl md:text-2xl font-black text-dark tracking-tighter uppercase">
            {mode === 'login' ? 'Welcome Back' : step === 1 ? 'Join the Movement' : 'Verify Email'}
          </h1>
          <p className="text-gray-400 mt-1 text-xs font-medium">
            {mode === 'login' 
              ? 'Login to your account' 
              : step === 1 
                ? 'Create your luxury account' 
                : `Enter the code sent to your email`}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <AnimatePresence mode="wait">
            {mode === 'register' && step === 1 && (
              <motion.div
                key="reg-name"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-gray-50 border-none rounded-xl py-3 px-5 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-dark font-medium text-sm"
                />
              </motion.div>
            )}

            {step === 1 ? (
              <motion.div key="step1-fields" className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full bg-gray-50 border-none rounded-xl py-3 px-5 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-dark font-medium text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border-none rounded-xl py-3 px-5 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-dark font-medium text-sm"
                  />
                </div>

                {mode === 'register' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border-none rounded-xl py-3 px-5 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-dark font-medium text-sm"
                    />
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="otp-field"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex justify-center">
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-center text-3xl font-black tracking-[0.4em] text-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  />
                </div>
                <p className="text-[10px] text-center text-gray-400 font-medium">
                  Check your inbox for the 6-digit verification code.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {mode === 'login' && (
            <div className="text-right">
              <Link to="/forgot-password" size="sm" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tighter">
                Forgot Password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-4 rounded-xl font-black text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50 mt-2"
          >
            {isLoading 
              ? 'Processing...' 
              : mode === 'login' 
                ? 'Sign In' 
                : step === 1 
                  ? 'Create Account' 
                  : 'Verify & Join'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-50 text-center">
          <p className="text-gray-400 font-medium text-xs">
            {mode === 'login' ? "Don't have an account?" : "Already a member?"}
            <button
              onClick={toggleMode}
              className="ml-2 text-primary font-bold hover:underline"
            >
              {mode === 'login' ? 'Register Now' : 'Sign In'}
            </button>
          </p>
        </div>

        {/* Social Login Divider */}
        {step === 1 && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-4 text-gray-300">
              <div className="h-[1px] flex-1 bg-gray-100" />
              <span className="text-[9px] font-bold uppercase tracking-widest">or continue with</span>
              <div className="h-[1px] flex-1 bg-gray-100" />
            </div>

            <a
              href="http://localhost:5000/api/auth/google"
              className="flex items-center justify-center gap-3 w-full bg-white border border-gray-100 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm text-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </a>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Auth
