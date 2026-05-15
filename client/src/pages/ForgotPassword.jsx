import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import axiosInstance from '../api/axiosInstance'

const ForgotPassword = () => {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSendOTP = async e => {
    e.preventDefault()
    if (!email) return toast.error('Please enter your email')
    setLoading(true)
    try {
      const res = await axiosInstance.post('/auth/forgot-password', { email })
      setUserId(res.data.userId)
      toast.success('OTP sent to your email!')
      setStep(2)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async e => {
    e.preventDefault()
    if (!otp || !password) return toast.error('Please fill all fields')
    if (password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      await axiosInstance.post('/auth/reset-password', { userId, otp, newPassword: password })
      toast.success('Password reset successfully!')
      setStep(3)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-light flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-8 w-full max-w-md relative overflow-hidden"
      >
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12" />
        
        <div className="text-center mb-6 relative">
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-5xl mb-2 select-none"
          >
            {step === 1 ? '🔐' : step === 2 ? '🔑' : '✨'}
          </motion.div>
          <h1 className="text-xl md:text-2xl font-black text-dark tracking-tighter uppercase">
            {step === 1 ? 'Recover Password' : step === 2 ? 'New Security' : 'Success!'}
          </h1>
          <p className="text-gray-400 mt-1 text-xs font-medium">
            {step === 1 ? 'Enter your email to receive a code' 
              : step === 2 ? 'Create a secure new password' 
              : 'Your password has been restored'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSendOTP} 
              className="space-y-4"
            >
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-gray-50 border-none rounded-xl py-3 px-5 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-dark font-medium text-sm"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-xl font-black text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50 mt-2"
              >
                {loading ? 'Sending Code...' : 'Send Recovery Code'}
              </button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleResetPassword} 
              className="space-y-4"
            >
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Verification Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full bg-gray-50 border-none rounded-xl py-3 px-5 text-center text-2xl font-black tracking-[0.3em] text-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border-none rounded-xl py-3 px-5 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-dark font-medium text-sm"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-xl font-black text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50 mt-2"
              >
                {loading ? 'Restoring...' : 'Update Password'}
              </button>
            </motion.form>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="py-4">
                <p className="text-gray-500 font-medium">Your account security has been updated successfully.</p>
              </div>
              <button 
                onClick={() => navigate('/login')}
                className="w-full bg-dark text-white py-4 rounded-xl font-black text-base shadow-lg hover:bg-black transition-all active:scale-95"
              >
                Back to Sign In
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {step !== 3 && (
          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <Link to="/login" className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">
              Back to Sign In
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default ForgotPassword