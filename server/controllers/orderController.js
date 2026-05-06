import Order from '../models/Order.js'
import Product from '../models/Product.js'
import Vendor from '../models/Vendor.js'

// ─── PLACE ORDER ─────────────────────────────────────────
export const placeOrder = async (req, res) => {
  try {
    const {
      items,
      deliveryAddress,
      notes,
    } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' })
    }

    if (!deliveryAddress) {
      return res.status(400).json({ success: false, message: 'Delivery address is required' })
    }

    // Calculate prices and validate products
    let itemsPrice = 0
    const orderItems = []

    for (const item of items) {
      const product = await Product.findById(item.productId)

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`
        })
      }

      if (!product.inStock) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock`
        })
      }

      // Get price based on size
      let price = product.basePrice
      if (item.size) {
        const sizeObj = product.sizes.find(s => s.label === item.size)
        if (sizeObj) price = sizeObj.price
      }

      // Add topping prices
      if (item.toppings && item.toppings.length > 0) {
        for (const toppingName of item.toppings) {
          const topping = product.toppings.find(t => t.name === toppingName)
          if (topping) price += topping.price
        }
      }

      const itemTotal = price * item.quantity
      itemsPrice += itemTotal

      orderItems.push({
        product:  product._id,
        name:     product.name,
        image:    product.image,
        quantity: item.quantity,
        size:     item.size || 'medium',
        toppings: item.toppings || [],
        price,
      })
    }

    // Delivery charge logic
    const deliveryCharge = itemsPrice > 500 ? 0 : 40
    const totalAmount    = itemsPrice + deliveryCharge

    // Create order
    const order = await Order.create({
      user:            req.user._id,
      items:           orderItems,
      deliveryAddress,
      paymentMethod:   'COD',
      paymentStatus:   'pending',
      orderStatus:     'placed',
      itemsPrice,
      deliveryCharge,
      totalAmount,
      notes: notes || '',
      statusHistory: [{ status: 'placed', note: 'Order placed successfully' }],
    })

    // Populate product details
    await order.populate('user', 'name email phone')

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── GET MY ORDERS ────────────────────────────────────────
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name image basePrice')
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, orders })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── GET SINGLE ORDER ─────────────────────────────────────
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user',          'name email phone')
      .populate('items.product', 'name image basePrice')

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    // Only allow user who placed order or admin
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    res.status(200).json({ success: true, order })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── CANCEL ORDER ─────────────────────────────────────────
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    // Only owner can cancel
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    // Can only cancel if placed or confirmed
    if (!['placed', 'confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order in ${order.orderStatus} status`
      })
    }

    order.orderStatus  = 'cancelled'
    order.cancelReason = req.body.reason || 'Cancelled by user'
    order.statusHistory.push({
      status: 'cancelled',
      note:   req.body.reason || 'Cancelled by user',
    })

    await order.save()

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── UPDATE ORDER STATUS (Admin) ──────────────────────────
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body

    const validStatuses = [
      'placed',
      'confirmed',
      'preparing',
      'out_for_delivery',
      'delivered',
      'cancelled',
    ]

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' })
    }

    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    order.orderStatus = status
    order.statusHistory.push({
      status,
      note: note || `Status updated to ${status}`,
    })

    // If delivered — update payment status and delivery time
    if (status === 'delivered') {
      order.paymentStatus = 'paid'
      order.deliveredAt   = new Date()
    }

    await order.save()

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── GET ALL ORDERS (Admin) ───────────────────────────────
export const getAllOrders = async (req, res) => {
  try {
    const {
      status,
      page  = 1,
      limit = 20,
    } = req.query

    const filter = {}
    if (status) filter.orderStatus = status

    const skip = (Number(page) - 1) * Number(limit)

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user',          'name email phone')
        .populate('items.product', 'name image')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(filter),
    ])

    res.status(200).json({
      success: true,
      total,
      page:       Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      orders,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── GET ORDER STATS (Admin) ──────────────────────────────
export const getOrderStats = async (req, res) => {
  try {
    const [
      totalOrders,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      revenueData,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: 'placed' }),
      Order.countDocuments({ orderStatus: 'delivered' }),
      Order.countDocuments({ orderStatus: 'cancelled' }),
      Order.aggregate([
        { $match: { orderStatus: 'delivered' } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
      ]),
    ])

    const totalRevenue = revenueData[0]?.totalRevenue || 0

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── CONFIRM COD PAYMENT (Admin) ──────────────────────────
export const confirmCODPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    if (order.paymentMethod !== 'COD') {
      return res.status(400).json({ success: false, message: 'Not a COD order' })
    }

    order.paymentStatus = 'paid'
    order.orderStatus   = 'delivered'
    order.deliveredAt   = new Date()
    order.statusHistory.push({
      status: 'delivered',
      note:   'COD payment confirmed and order delivered',
    })

    await order.save()

    res.status(200).json({
      success: true,
      message: 'COD payment confirmed',
      order,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}