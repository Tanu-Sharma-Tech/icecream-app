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
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'icecream-app/products',
      })
      imageUrl = result.secure_url
    }

    const product = await Product.create({
      name,
      description,
      category,
      flavors:       flavors       ? JSON.parse(flavors)   : [],
      toppings:      toppings      ? JSON.parse(toppings)  : [],
      sizes:         sizes         ? JSON.parse(sizes)     : [],
      basePrice,
      image:         imageUrl,
      inStock:       inStock !== undefined ? inStock : true,
      stockQuantity: stockQuantity || 100,
      isFeatured:    isFeatured || false,
      tags:          tags ? JSON.parse(tags) : [],
      vendor:        vendor || null,
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
    if (updates.flavors)  updates.flavors  = JSON.parse(updates.flavors)
    if (updates.toppings) updates.toppings = JSON.parse(updates.toppings)
    if (updates.sizes)    updates.sizes    = JSON.parse(updates.sizes)
    if (updates.tags)     updates.tags     = JSON.parse(updates.tags)

    // Upload new image if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'icecream-app/products',
      })
      updates.image = result.secure_url
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
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