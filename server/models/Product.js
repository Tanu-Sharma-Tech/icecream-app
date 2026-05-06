import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['icecream', 'sundae', 'milkshake', 'popsicle', 'waffle', 'other'],
      default: 'icecream',
    },
    flavors: [
      {
        name:  { type: String, required: true },
        color: { type: String, default: '#FFD700' },
      }
    ],
    toppings: [
      {
        name:  { type: String },
        price: { type: Number, default: 0 },
      }
    ],
    sizes: [
      {
        label: { type: String, enum: ['small', 'medium', 'large'], required: true },
        price: { type: Number, required: true },
      }
    ],
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: 0,
    },
    image: {
      type: String,
      default: '',
    },
    images: [{ type: String }],
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      default: null,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      default: 100,
    },
    ratings: {
      average: { type: Number, default: 0 },
      count:   { type: Number, default: 0 },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: [{ type: String }],
  },
  { timestamps: true }
)

productSchema.index({ name: 'text', description: 'text' })

const Product = mongoose.model('Product', productSchema)
export default Product