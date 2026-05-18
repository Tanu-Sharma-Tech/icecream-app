import User from '../models/User.js'
import { sendTokens } from '../utils/generateToken.js'
import { sendOTPEmail, sendWelcomeEmail } from '../utils/sendEmail.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

// Generate 6 digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString()

// ─── REGISTER ────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' })
    }

    if (typeof email !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid email format' })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() })
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' })
    }

    const otp       = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    const salt           = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      otp,
      otpExpiry,
      isVerified: false,
    })

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, name)
    } catch (emailError) {
      console.error('OTP email failed:', emailError.message)
    }

  res.status(201).json({
    success: true,
    message: 'OTP sent to your email. Please verify to complete registration.',
    userId: user._id,
    devOtp: otp, // Added for testing purposes so you can login even if emails fail
  })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── VERIFY OTP ──────────────────────────────────────────
export const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body

    if (!userId || !otp) {
      return res.status(400).json({ success: false, message: 'userId and OTP are required' })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    // Check OTP
    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' })
    }

    // Check OTP expiry
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP expired. Please request a new one.' })
    }

    // Mark user as verified
    user.isVerified = true
    user.otp        = null
    user.otpExpiry  = null
    await user.save({ validateBeforeSave: false })

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name)

    // Send tokens
    await sendTokens(user, res, 200)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── RESEND OTP ───────────────────────────────────────────
export const resendOTP = async (req, res) => {
  try {
    const { userId } = req.body

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'User already verified' })
    }

    const otp       = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    user.otp       = otp
    user.otpExpiry = otpExpiry
    await user.save({ validateBeforeSave: false })

    await sendOTPEmail(user.email, otp, user.name)

    res.status(200).json({ success: true, message: 'New OTP sent to your email' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── LOGIN ────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' })
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    // Check if google user tries to login with password
    if (user.authProvider === 'google') {
      return res.status(400).json({ success: false, message: 'Please login with Google' })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    // Check if verified
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email first',
        userId: user._id,
      })
    }

    await sendTokens(user, res, 200)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── LOGOUT ───────────────────────────────────────────────
export const logout = async (req, res) => {
  try {
    // Clear refresh token from DB
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null })

    // Clear cookie
    res.clearCookie('refreshToken')

    res.status(200).json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── GET CURRENT USER ─────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.status(200).json({ success: true, user })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── REFRESH TOKEN ────────────────────────────────────────
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken
    if (!token) {
      return res.status(401).json({ success: false, message: 'No refresh token' })
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    const user    = await User.findById(decoded.id)

    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' })
    }

    await sendTokens(user, res, 200)
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token expired, please login again' })
  }
}

// ─── GOOGLE OAUTH CALLBACK ────────────────────────────────
// export const googleCallback = async (req, res) => {
//   try {
//     await sendTokens(req.user, res, 200)
//   } catch (error) {
//     res.redirect(`${process.env.CLIENT_URL}/login?error=google_auth_failed`)
//   }
// }

// ─── FORGOT PASSWORD (send OTP) ───────────────────────────
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email' })
    }

    const otp       = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    user.otp       = otp
    user.otpExpiry = otpExpiry
    await user.save({ validateBeforeSave: false })

    await sendOTPEmail(email, otp, user.name)

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email',
      userId: user._id,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── RESET PASSWORD ───────────────────────────────────────
export const resetPassword = async (req, res) => {
  try {
    const { userId, otp, newPassword } = req.body

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    if (user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' })
    }

    // Hash new password before saving
    const salt           = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    // Use findByIdAndUpdate to skip pre-save hook
    await User.findByIdAndUpdate(userId, {
      password:  hashedPassword,
      otp:       null,
      otpExpiry: null,
    })

    res.status(200).json({ success: true, message: 'Password reset successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── UPDATE PROFILE ───────────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, street, city, state, pincode } = req.body
    
    // Server-side validation
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Name must be at least 2 characters' })
    }
    
    if (phone && !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Phone number must be 10 digits' })
    }

    const updateData = { 
      name, 
      phone,
      address: {
        street:  street  || '',
        city:    city    || '',
        state:   state   || '',
        pincode: pincode || '',
      }
    }

    // Handle image upload if present
    if (req.file) {
      const { uploadToCloudinary } = await import('../utils/cloudinaryUpload.js')
      const imageUrl = await uploadToCloudinary(req.file.buffer)
      updateData.profileImage = imageUrl
    }
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -refreshToken')

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.status(200).json({ 
      success: true, 
      message: 'Profile updated successfully', 
      user 
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}