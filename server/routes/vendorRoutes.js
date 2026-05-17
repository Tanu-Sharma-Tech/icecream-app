import express from 'express'
import {
  createVendor,
  getVendors,
  getVendorById,
  getMyVendorProfile,
  updateVendorProfile,
  updateBankDetails,
  addProductToVendor,
  toggleProductAvailability,
  getVendorProducts,
  applyForVendor,
  verifyVendorCode,
  cancelVendorApplication,
} from '../controllers/vendorController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public routes
router.get('/',      getVendors)
router.get('/:id',   getVendorById)

// Protected routes
router.post('/apply',                                     protect, applyForVendor)
router.post('/verify-code',                               protect, verifyVendorCode)
router.post('/cancel',                                    protect, cancelVendorApplication)
router.post('/',                                          protect, createVendor)
router.get('/my/profile',                                protect, getMyVendorProfile)
router.put('/my/profile',                                protect, updateVendorProfile)
router.put('/my/bank-details',                           protect, updateBankDetails)
router.get('/my/products',                               protect, getVendorProducts)
router.post('/my/products/:productId',                   protect, addProductToVendor)
router.patch('/my/products/:productId/toggle',           protect, toggleProductAvailability)

export default router