import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import axiosInstance from '../api/axiosInstance'

const ForgotPassword = () => {
  const [step,     setStep]     = useState(1)
  const [email,    setEmail]    = useState('')
  const [userId,   setUserId]   = useState('')
  const [otp,      setOtp]      = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)

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
    <div className="min-h-screen bg-light flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🔐</div>
          <h1 className="text-3xl font-bold text-dark">
            {step === 1 ? 'Forgot Password'
            : step === 2 ? 'Reset Password'
            : 'Password Reset!'}
          </h1>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input-field"
              />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-all disabled:opacity-50">
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="6-digit OTP"
                maxLength={6}
                className="input-field text-center text-2xl font-bold tracking-widest"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="New password"
                className="input-field"
              />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-all disabled:opacity-50">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        {/* Step 3 - Success */}
        {step === 3 && (
          <div className="text-center space-y-4">
            <div className="text-6xl">✅</div>
            <p className="text-gray-500">Your password has been reset successfully!</p>
            <Link to="/login"
              className="block w-full bg-primary text-white py-3 rounded-xl font-semibold text-center hover:bg-orange-600 transition-all">
              Go to Login
            </Link>
          </div>
        )}

        {step !== 3 && (
          <p className="text-center text-gray-500 mt-6">
            Remember password?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Login</Link>
          </p>
        )}
      </motion.div>
    </div>
  )
}

export default ForgotPassword