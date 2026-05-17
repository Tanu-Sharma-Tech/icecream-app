import User from '../models/User.js'
import Product from '../models/Product.js'
import Order from '../models/Order.js'
import Vendor from '../models/Vendor.js'

// ─── DASHBOARD STATS ─────────────────────────────────────
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalVendors,
      revenueData,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      recentOrders,
      lowStockProducts,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Product.countDocuments(),
      Order.countDocuments(),
      Vendor.countDocuments(),
      Order.aggregate([
        { $match: { orderStatus: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.countDocuments({ orderStatus: 'placed' }),
      Order.countDocuments({ orderStatus: 'delivered' }),
      Order.countDocuments({ orderStatus: 'cancelled' }),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email'),
      Product.find({ stockQuantity: { $lt: 10 } })
        .select('name stockQuantity inStock'),
    ])

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalVendors,
        totalRevenue:    revenueData[0]?.total || 0,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
      },
      recentOrders,
      lowStockProducts,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── USER MANAGEMENT ──────────────────────────────────────
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query

    const filter = {}
    if (role)   filter.role = role
    if (search) filter.$or = [
      { name:  { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ]

    const skip = (Number(page) - 1) * Number(limit)

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password -refreshToken -otp -otpExpiry')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(filter),
    ])

    res.status(200).json({
      success: true,
      total,
      page:       Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      users,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -refreshToken -otp -otpExpiry')

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.status(200).json({ success: true, user })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body

    if (!['user', 'admin', 'vendor'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' })
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password -refreshToken')

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.status(200).json({ success: true, message: `User role updated to ${role}`, user })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    // Prevent deleting admin
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete admin user' })
    }

    await User.findByIdAndDelete(req.params.id)
    res.status(200).json({ success: true, message: 'User deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── VENDOR MANAGEMENT ────────────────────────────────────
export const getAllVendorsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, isApproved } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    // Aggregate to find all users with role 'vendor' and their optional profile
    const aggregatePipeline = [
      { $match: { role: 'vendor' } },
      {
        $lookup: {
          from: 'vendors',
          localField: '_id',
          foreignField: 'user',
          as: 'profile'
        }
      },
      { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } }
    ]

    // Apply isApproved filter if provided
    if (isApproved !== undefined) {
      const approved = isApproved === 'true'
      aggregatePipeline.push({
        $match: {
          'profile.isApproved': approved
        }
      })
    }

    const [allVendors, totalCount] = await Promise.all([
      User.aggregate([
        ...aggregatePipeline,
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: Number(limit) }
      ]),
      User.aggregate([
        ...aggregatePipeline,
        { $count: 'total' }
      ])
    ])

    // Format the response to match what the frontend expects
    const vendors = allVendors.map(v => ({
      _id:        v.profile?._id || `temp_${v._id}`, // Use profile ID or temp ID
      user:       { _id: v._id, name: v.name, email: v.email },
      storeName:  v.profile?.storeName || 'Profile Incomplete',
      phone:      v.profile?.phone || 'N/A',
      address:    v.profile?.address || { city: 'N/A', state: 'N/A' },
      isApproved: v.profile?.isApproved || false,
      isActive:   v.profile?.isActive   || false,
      products:   v.profile?.products   || [],
      totalOrders:v.profile?.totalOrders || 0,
      createdAt:  v.profile?.createdAt  || v.createdAt,
      isMissingProfile: !v.profile
    }))

    res.status(200).json({
      success: true,
      total:      totalCount[0]?.total || 0,
      page:       Number(page),
      totalPages: Math.ceil((totalCount[0]?.total || 0) / Number(limit)),
      vendors,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const approveVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { isApproved: true, isActive: true },
      { new: true }
    ).populate('user', 'name email')

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' })
    }

    res.status(200).json({ success: true, message: 'Vendor approved successfully', vendor })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const rejectVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { isApproved: false, isActive: false },
      { new: true }
    )

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' })
    }

    res.status(200).json({ success: true, message: 'Vendor rejected', vendor })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── INVENTORY MANAGEMENT ─────────────────────────────────
export const getInventory = async (req, res) => {
  try {
    const { inStock, category, page = 1, limit = 20 } = req.query

    const filter = {}
    if (inStock  !== undefined) filter.inStock  = inStock === 'true'
    if (category)               filter.category = category

    const skip = (Number(page) - 1) * Number(limit)

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('vendor', 'storeName')
        .sort({ stockQuantity: 1 })
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ])

    res.status(200).json({
      success: true,
      total,
      page:       Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      products,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const updateInventory = async (req, res) => {
  try {
    const { stockQuantity, inStock } = req.body

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stockQuantity, inStock },
      { new: true }
    )

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    res.status(200).json({ success: true, message: 'Inventory updated', product })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── PAYMENT RECORDS ──────────────────────────────────────
export const getPaymentRecords = async (req, res) => {
  try {
    const {
      paymentStatus,
      paymentMethod,
      page  = 1,
      limit = 20,
    } = req.query

    const filter = {}
    if (paymentStatus) filter.paymentStatus = paymentStatus
    if (paymentMethod) filter.paymentMethod = paymentMethod

    const skip = (Number(page) - 1) * Number(limit)

    const [orders, total, revenueData] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email phone')
        .select('user totalAmount paymentMethod paymentStatus orderStatus createdAt deliveredAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(filter),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
    ])

    res.status(200).json({
      success:      true,
      total,
      page:         Number(page),
      totalPages:   Math.ceil(total / Number(limit)),
      totalRevenue: revenueData[0]?.total || 0,
      orders,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── REVENUE ANALYTICS ────────────────────────────────────
export const getRevenueAnalytics = async (req, res) => {
  try {
    const monthlyRevenue = await Order.aggregate([
      { $match: { orderStatus: 'delivered' } },
      {
        $group: {
          _id: {
            year:  { $year:  '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$totalAmount' },
          orders:  { $sum: 1 },
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ])

    const categoryRevenue = await Order.aggregate([
      { $match: { orderStatus: 'delivered' } },
      { $unwind: '$items' },
      {
        $lookup: {
          from:         'products',
          localField:   'items.product',
          foreignField: '_id',
          as:           'productInfo',
        }
      },
      { $unwind: '$productInfo' },
      {
        $group: {
          _id:     '$productInfo.category',
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          count:   { $sum: '$items.quantity' },
        }
      },
    ])

    res.status(200).json({
      success: true,
      monthlyRevenue,
      categoryRevenue,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── SEND VENDOR VERIFICATION CODE ────────────────────────
export const sendVendorVerificationCode = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })

    if (user.vendorStatus !== 'pending') {
      return res.status(400).json({ success: false, message: 'User has not applied or already approved' })
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    user.vendorCode = code
    user.vendorStatus = 'approved'
    await user.save({ validateBeforeSave: false })

    const { sendVendorVerificationCodeEmail } = await import('../utils/sendEmail.js')
    await sendVendorVerificationCodeEmail(user.email, user.name, code)

    res.status(200).json({ success: true, message: 'Verification code sent to user successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}