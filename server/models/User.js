import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
    phone: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'vendor'],
      default: 'user',
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    profileImage: {
      type: String,
      default: '',
    },
    address: {
      street:  { type: String, default: '' },
      city:    { type: String, default: '' },
      state:   { type: String, default: '' },
      pincode: { type: String, default: '' },
    },
    refreshToken: {
      type: String,
      default: null,
    },
    vendorStatus: {
      type: String,
      enum: ['none', 'pending', 'approved', 'rejected'],
      default: 'none',
    },
    vendorCode: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
)


userSchema.index({ role: 1 })
userSchema.index({ createdAt: -1 })

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  const bcrypt = await import('bcryptjs')
  if (!this.password) return false
  return bcrypt.default.compare(enteredPassword, this.password)
}

// Hide sensitive fields
userSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.password
  delete user.otp
  delete user.otpExpiry
  delete user.refreshToken
  return user
}

const User = mongoose.model('User', userSchema)
export default User