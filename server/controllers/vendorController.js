import Vendor from '../models/Vendor.js'
import Product from '../models/Product.js'
import User from '../models/User.js'

// ─── CREATE VENDOR ────────────────────────────────────────
export const createVendor = async (req, res) => {
  try {
    const {
      storeName, description, phone,
      email, address, deliveryAreas,
    } = req.body

    // Check if vendor already exists for this user
    const existingVendor = await Vendor.findOne({ user: req.user._id })
    if (existingVendor) {
      return res.status(400).json({ success: false, message: 'Vendor profile already exists' })
    }

    // Safety parse
    const parseJSON = (str) => {
      try { return JSON.parse(str) } catch { return null }
    }

    const vendor = await Vendor.create({
      user:         req.user._id,
      storeName,
      description,
      phone,
      email,
      address:       parseJSON(address)       || {},
      deliveryAreas: parseJSON(deliveryAreas) || [],
    })

    // Update user role to vendor
    await User.findByIdAndUpdate(req.user._id, { role: 'vendor' })

    res.status(201).json({ success: true, vendor })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── GET ALL VENDORS ──────────────────────────────────────
export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({ isActive: true, isApproved: true })
      .populate('user', 'name email')
      .select('-bankDetails')

    res.status(200).json({ success: true, vendors })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── GET VENDOR BY ID ─────────────────────────────────────
export const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id)
      .populate('user', 'name email')
      .populate('products')
      .select('-bankDetails')

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' })
    }

    res.status(200).json({ success: true, vendor })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── GET MY VENDOR PROFILE ────────────────────────────────
export const getMyVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id })
      .populate('products')

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' })
    }

    res.status(200).json({ success: true, vendor })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── UPDATE VENDOR PROFILE ────────────────────────────────
export const updateVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id })
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' })
    }

    const { storeName, description, phone, email, address, deliveryAreas } = req.body
    
    // Safety parse
    const parseJSON = (str) => {
      try { return typeof str === 'string' ? JSON.parse(str) : str } catch { return str }
    }

    const updates = {
      storeName:   storeName   || vendor.storeName,
      description: description || vendor.description,
      phone:       phone       || vendor.phone,
      email:       email       || vendor.email,
      address:       parseJSON(address)       || vendor.address,
      deliveryAreas: parseJSON(deliveryAreas) || vendor.deliveryAreas,
    }

    const updatedVendor = await Vendor.findByIdAndUpdate(
      vendor._id,
      { $set: updates },
      { new: true, runValidators: true }
    )

    res.status(200).json({ success: true, vendor: updatedVendor })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── UPDATE BANK DETAILS ──────────────────────────────────
export const updateBankDetails = async (req, res) => {
  try {
    const { accountName, accountNumber, ifscCode, bankName } = req.body

    if (!accountName || !accountNumber || !ifscCode) {
      return res.status(400).json({ success: false, message: 'Missing required bank details' })
    }

    const vendor = await Vendor.findOneAndUpdate(
      { user: req.user._id },
      { bankDetails: { accountName, accountNumber, ifscCode, bankName } },
      { new: true }
    )

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' })
    }

    res.status(200).json({ success: true, message: 'Bank details updated' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── ADD PRODUCT TO VENDOR ────────────────────────────────
export const addProductToVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id })
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' })
    }

    const product = await Product.findById(req.params.productId)
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    // Add product to vendor
    if (!vendor.products.includes(req.params.productId)) {
      vendor.products.push(req.params.productId)
      await vendor.save()
    }

    // Link vendor to product
    product.vendor = vendor._id
    await product.save()

    res.status(200).json({ success: true, message: 'Product added to vendor' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── TOGGLE PRODUCT AVAILABILITY ─────────────────────────
export const toggleProductAvailability = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id })
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' })
    }

    // Check product belongs to vendor
    if (!vendor.products.includes(req.params.productId)) {
      return res.status(403).json({ success: false, message: 'Product does not belong to this vendor' })
    }

    const product = await Product.findById(req.params.productId)
    product.inStock = !product.inStock
    await product.save()

    res.status(200).json({
      success: true,
      message: `Product is now ${product.inStock ? 'available' : 'unavailable'}`,
      inStock: product.inStock,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── GET VENDOR PRODUCTS ──────────────────────────────────
export const getVendorProducts = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id })
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' })
    }

    const products = await Product.find({ vendor: vendor._id })
    res.status(200).json({ success: true, products })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── APPLY FOR VENDOR ─────────────────────────────────────
export const applyForVendor = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    if (user.role === 'vendor') {
      return res.status(400).json({ success: false, message: 'You are already a vendor' })
    }

    if (user.vendorStatus === 'pending') {
      return res.status(400).json({ success: false, message: 'Your application is already pending' })
    }

    user.vendorStatus = 'pending'
    await user.save({ validateBeforeSave: false })

    const { sendVendorApplicationEmail } = await import('../utils/sendEmail.js')
    await sendVendorApplicationEmail(user.email, user.name)

    res.status(200).json({ success: true, message: 'Application submitted successfully. We have sent you an email.' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── VERIFY VENDOR CODE ───────────────────────────────────
export const verifyVendorCode = async (req, res) => {
  try {
    const { code } = req.body
    if (!code) {
      return res.status(400).json({ success: false, message: 'Verification code is required' })
    }

    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    if (user.vendorStatus !== 'approved' || !user.vendorCode) {
      return res.status(400).json({ success: false, message: 'No approved application or code found' })
    }

    if (user.vendorCode !== code) {
      return res.status(400).json({ success: false, message: 'Invalid verification code' })
    }

    // Success: make them a vendor
    user.role = 'vendor'
    user.vendorStatus = 'none'
    user.vendorCode = null
    await user.save({ validateBeforeSave: false })

    res.status(200).json({ success: true, message: 'Congratulations! You are now a vendor.', role: user.role })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── CANCEL VENDOR APPLICATION ────────────────────────────
export const cancelVendorApplication = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    if (user.vendorStatus !== 'pending' && user.vendorStatus !== 'approved') {
      return res.status(400).json({ success: false, message: 'No active application to cancel' })
    }

    user.vendorStatus = 'none'
    user.vendorCode = null
    await user.save({ validateBeforeSave: false })

    const { sendVendorCancellationEmail } = await import('../utils/sendEmail.js')
    await sendVendorCancellationEmail(user.email, user.name)

    res.status(200).json({ success: true, message: 'Vendor application cancelled successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}