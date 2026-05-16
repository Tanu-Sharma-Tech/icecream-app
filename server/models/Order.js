import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name:     { type: String, required: true },
  image:    { type: String, default: '' },
  quantity: { type: Number, required: true, min: 1 },
  size:     { type: String, default: 'medium' },
  toppings: [{ type: String }],
  price:    { type: Number, required: true },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
})

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    deliveryAddress: {
      name:    { type: String, required: true },
      phone:   { type: String, required: true },
      street:  { type: String, required: true },
      city:    { type: String, required: true },
      state:   { type: String, required: true },
      pincode: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ['COD'],
      default: 'COD',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: [
        'placed',
        'confirmed',
        'preparing',
        'out_for_delivery',
        'delivered',
        'cancelled',
      ],
      default: 'placed',
    },
    statusHistory: [
      {
        status:    { type: String },
        timestamp: { type: Date, default: Date.now },
        note:      { type: String, default: '' },
      }
    ],
    itemsPrice:     { type: Number, required: true },
    deliveryCharge: { type: Number, default: 0 },
    totalAmount:    { type: Number, required: true },
    deliveredAt:    { type: Date, default: null },
    cancelReason:   { type: String, default: '' },
    notes:          { type: String, default: '' },
  },
  { timestamps: true }
)

orderSchema.index({ user: 1 })
orderSchema.index({ orderStatus: 1 })
orderSchema.index({ createdAt: -1 })
orderSchema.index({ 'items.vendor': 1 })

const Order = mongoose.model('Order', orderSchema)
export default Order