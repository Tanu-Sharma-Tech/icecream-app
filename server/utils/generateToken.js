import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  )
}

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  )
}

export const sendTokens = async (user, res, statusCode = 200) => {
  const accessToken  = generateAccessToken(user._id, user.role)
  const refreshToken = generateRefreshToken(user._id)

  // Save refresh token to DB directly without triggering pre-save hook
  await User.findByIdAndUpdate(
    user._id,
    { refreshToken },
    { new: true }
  )

  // Set refresh token in HTTP-only cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })

  // Get clean user object
  const userObj = user.toJSON ? user.toJSON() : user

  res.status(statusCode).json({
    success: true,
    accessToken,
    user: userObj,
  })
}