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

    if (category && category !== 'all') {
      filter.category = category
    }
    
    if (inStock !== undefined && inStock !== '') {
      filter.inStock = inStock === 'true'
    }

    if (search && search.trim() !== '') {
      filter.$text = { $search: search }
    }

    const sortObj = { [sort]: order === 'desc' ? -1 : 1 }
    const skip    = (Math.max(0, Number(page) - 1)) * Number(limit)

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
      count:      products.length,
      page:       Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      products,
    })
  } catch (error) {
    console.error('GET_PRODUCTS_ERROR:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Unable to load products. Please check database connection.',
      error:   error.message 
    })
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

    // CHECK OWNERSHIP (unless Admin)
    const vendor = await Vendor.findOne({ user: req.user._id })
    const isOwner = vendor && product.vendor?.toString() === vendor._id.toString()
    const isAdmin = req.user.role === 'admin'

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this product' })
    }

    const { 
      name, description, category, flavors, toppings, 
      sizes, basePrice, inStock, stockQuantity, isFeatured, tags 
    } = req.body

    const parseJSON = (str) => {
      try { return typeof str === 'string' ? JSON.parse(str) : str } catch { return str }
    }

    const updates = {
      name:        name        || product.name,
      description: description || product.description,
      category:    category    || product.category,
      flavors:     parseJSON(flavors)  || product.flavors,
      toppings:    parseJSON(toppings) || product.toppings,
      sizes:       parseJSON(sizes)    || product.sizes,
      basePrice:   basePrice           || product.basePrice,
      inStock:     inStock !== undefined ? (String(inStock) === 'true' || inStock === true) : product.inStock,
      stockQuantity: stockQuantity || product.stockQuantity,
      isFeatured:    isAdmin ? (isFeatured !== undefined ? (String(isFeatured) === 'true' || isFeatured === true) : product.isFeatured) : product.isFeatured,
      tags:          parseJSON(tags) || product.tags,
    }

    // Handle new image
    if (req.file) {
      const { uploadToCloudinary } = await import('../utils/cloudinaryUpload.js')
      updates.image = await uploadToCloudinary(req.file.buffer, 'products')
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    )

    res.status(200).json({ success: true, product: updatedProduct })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─── DELETE PRODUCT ───────────────────────────────────────
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    // Ownership check
    const vendor = await Vendor.findOne({ user: req.user._id })
    const isOwner = vendor && product.vendor?.toString() === vendor._id.toString()
    const isAdmin = req.user.role === 'admin'

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this product' })
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