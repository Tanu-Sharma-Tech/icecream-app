import express from 'express'
import {
  register,
  verifyOTP,
  resendOTP,
  login,
  logout,
  getMe,
  refreshToken,
  forgotPassword,
  resetPassword,
  updateProfile,
} from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router()

// Email + Password Auth
router.post('/register',        register)
router.post('/verify-otp',      verifyOTP)
router.post('/resend-otp',      resendOTP)
router.post('/login',           login)
router.post('/logout',          protect, logout)
router.get('/me',               protect, getMe)
router.put('/update-profile',   protect, upload.single('image'), updateProfile)
router.post('/refresh-token',   refreshToken)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password',  resetPassword)

export default router