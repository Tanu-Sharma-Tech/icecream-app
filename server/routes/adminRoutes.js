import express from 'express'
import {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getAllVendorsAdmin,
  approveVendor,
  rejectVendor,
  getInventory,
  updateInventory,
  getPaymentRecords,
  getRevenueAnalytics,
  sendVendorVerificationCode,
} from '../controllers/adminController.js'
import { protect }   from '../middleware/authMiddleware.js'
import { adminOnly } from '../middleware/roleGuard.js'

const router = express.Router()

// All admin routes are protected
router.use(protect)
router.use(adminOnly)

// Dashboard
router.get('/dashboard',           getDashboardStats)
router.get('/revenue',             getRevenueAnalytics)

// User management
router.get('/users',               getAllUsers)
router.get('/users/:id',           getUserById)
router.put('/users/:id/role',      updateUserRole)
router.post('/users/:id/send-vendor-code', sendVendorVerificationCode)
router.delete('/users/:id',        deleteUser)

// Vendor management
router.get('/vendors',             getAllVendorsAdmin)
router.put('/vendors/:id/approve', approveVendor)
router.put('/vendors/:id/reject',  rejectVendor)

// Inventory
router.get('/inventory',           getInventory)
router.put('/inventory/:id',       updateInventory)

// Payments
router.get('/payments',            getPaymentRecords)

export default router