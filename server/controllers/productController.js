import Product from '../models/Product.js'
import cloudinary from '../config/cloudinary.js'

// ─── GET ALL PRODUCTS ─────────────────────────────────────
export const getProducts = async (req, res) => {
  try {
    const {
      category,
      inStock,
      search,
      sort = 'createdAt',
      order = 'desc',
      page  = 1,
      limit = 12,
    } = req.query

    const filter = {}

    if (category) filter.category = category
    if (inStock !== undefined) filter.inStock = inStock === 'true'
    if (search) filter.$text = { $search: search }

    const sortObj = { [sort]: order === 'desc' ? -1 : 1 }
    const skip    = (Number(page) - 1) * Number(limit)

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(Number(limit))
        .populate('vendor', 'storeName phone'),
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

// ─── GET SINGLE PRODUCT ───────────────────────────────────
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('vendor', 'storeName phone email')

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    res.status(200).json({ success: true, product })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── CREATE PRODUCT ───────────────────────────────────────
export const createProduct = async (req, res) => {
  try {
    const {
      name, description, category,
      flavors, toppings, sizes,
      basePrice, inStock, stockQuantity,
      isFeatured, tags, vendor,
    } = req.body

    let imageUrl = ''

    // Upload image to cloudinary if provided
    if (req.file) {
      const { uploadToCloudinary } = await import('../utils/cloudinaryUpload.js')
      imageUrl = await uploadToCloudinary(req.file.buffer, 'products')
    }

    const product = await Product.create({
      name,
      description,
      category,
      flavors:       flavors  ? (typeof flavors === 'string' ? JSON.parse(flavors) : flavors)   : [],
      toppings:      toppings ? (typeof toppings === 'string' ? JSON.parse(toppings) : toppings)  : [],
      sizes:         sizes    ? (typeof sizes === 'string' ? JSON.parse(sizes) : sizes)     : [],
      basePrice:     Number(basePrice),
      image:         imageUrl,
      inStock:       inStock !== undefined ? (String(inStock) === 'true' || inStock === true) : true,
      stockQuantity: stockQuantity ? Number(stockQuantity) : 100,
      isFeatured:    isFeatured !== undefined ? (String(isFeatured) === 'true' || isFeatured === true) : false,
      tags:          tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : [],
      vendor:        vendor || req.user._id,
    })

    res.status(201).json({ success: true, product })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── UPDATE PRODUCT ───────────────────────────────────────
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    const updates = { ...req.body }

    // Parse JSON strings if sent as form data
    if (updates.flavors)  updates.flavors  = typeof updates.flavors === 'string' ? JSON.parse(updates.flavors) : updates.flavors
    if (updates.toppings) updates.toppings = typeof updates.toppings === 'string' ? JSON.parse(updates.toppings) : updates.toppings
    if (updates.sizes)    updates.sizes    = typeof updates.sizes === 'string' ? JSON.parse(updates.sizes) : updates.sizes
    if (updates.tags)     updates.tags     = typeof updates.tags === 'string' ? JSON.parse(updates.tags) : updates.tags
    
    if (updates.basePrice)     updates.basePrice = Number(updates.basePrice)
    if (updates.stockQuantity) updates.stockQuantity = Number(updates.stockQuantity)
    if (updates.inStock)       updates.inStock = String(updates.inStock) === 'true' || updates.inStock === true
    if (updates.isFeatured)    updates.isFeatured = String(updates.isFeatured) === 'true' || updates.isFeatured === true

    // Upload new image if provided
    console.log('File Received:', req.file)
    console.log('Body Received:', req.body)

    if (req.file) {
      try {
        const { uploadToCloudinary } = await import('../utils/cloudinaryUpload.js')
        const uploadedUrl = await uploadToCloudinary(req.file.buffer, 'products')
        console.log('Cloudinary Upload Success:', uploadedUrl)
        updates.image = uploadedUrl
      } catch (uploadError) {
        console.error('Cloudinary Upload Error:', uploadError)
        return res.status(500).json({ success: false, message: 'Image upload failed' })
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updates }, // Use $set to be explicit
      { new: true, runValidators: true }
    )

    res.status(200).json({ success: true, product: updatedProduct })
  } catch (error) {
    console.error('UPDATE_PRODUCT_ERROR:', error)
    res.status(500).json({ 
      success: false, 
      message: error.name === 'ValidationError' 
        ? Object.values(error.errors).map(e => e.message).join(', ') 
        : error.message 
    })
  }
}

// ─── DELETE PRODUCT ───────────────────────────────────────
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    await Product.findByIdAndDelete(req.params.id)
    res.status(200).json({ success: true, message: 'Product deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── TOGGLE STOCK ─────────────────────────────────────────
export const toggleStock = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    product.inStock = !product.inStock
    await product.save()

    res.status(200).json({
      success: true,
      message: `Product is now ${product.inStock ? 'in stock' : 'out of stock'}`,
      inStock: product.inStock,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── GET FEATURED PRODUCTS ────────────────────────────────
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, inStock: true })
      .limit(8)
      .populate('vendor', 'storeName')

    res.status(200).json({ success: true, products })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── ADD REVIEW ───────────────────────────────────────────
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    const review = {
      user:    req.user._id,
      name:    req.user.name,
      rating:  Number(rating),
      comment,
    }

    product.reviews.push(review)
    product.ratings.count = product.reviews.length
    product.ratings.average = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save()
    res.status(201).json({ success: true, message: 'Review added', product })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── GET PRODUCTS BY CATEGORY ─────────────────────────────
export const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.category,
      inStock:  true,
    }).populate('vendor', 'storeName')

    res.status(200).json({ success: true, products })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}