import express from 'express'
import multer from 'multer'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleStock,
  getFeaturedProducts,
  getProductsByCategory,
} from '../controllers/productController.js'
import { protect } from '../middleware/authMiddleware.js'
import { adminOnly, adminOrVendor } from '../middleware/roleGuard.js'

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

// ⚠️ IMPORTANT: specific routes MUST come before /:id
router.get('/featured',           getFeaturedProducts)
router.get('/category/:category', getProductsByCategory)
router.get('/',                   getProducts)
router.get('/:id',                getProductById)

// Protected routes
router.post('/',                      protect, adminOrVendor, upload.single('image'), createProduct)
router.put('/:id',                    protect, adminOrVendor, upload.single('image'), updateProduct)
router.delete('/:id',                 protect, adminOnly,                             deleteProduct)
router.patch('/:id/toggle-stock',     protect, adminOrVendor,                        toggleStock)

export default router