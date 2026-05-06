import mongoose from 'mongoose'

const vendorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    storeName: {
      type: String,
      required: [true, 'Store name is required'],
      trim: true,
    },
    storeImage: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    address: {
      street:  { type: String, default: '' },
      city:    { type: String, required: true },
      state:   { type: String, required: true },
      pincode: { type: String, required: true },
    },
    deliveryAreas: [{ type: String }],
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      }
    ],
    isActive:   { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },
    bankDetails: {
      accountName:   { type: String, default: '' },
      accountNumber: { type: String, default: '' },
      ifscCode:      { type: String, default: '' },
      bankName:      { type: String, default: '' },
    },
    totalOrders:  { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    ratings: {
      average: { type: Number, default: 0 },
      count:   { type: Number, default: 0 },
    },
  },
  { timestamps: true }
)

const Vendor = mongoose.model('Vendor', vendorSchema)
export default Vendor