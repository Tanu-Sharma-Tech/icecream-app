import express from 'express'
import {
  placeOrder,
  getMyOrders,
  getVendorOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  getAllOrders,
  getOrderStats,
  confirmCODPayment,
} from '../controllers/orderController.js'
import { protect } from '../middleware/authMiddleware.js'
import { authorize } from '../middleware/roleGuard.js'

const router = express.Router()

router.post('/',               protect,            placeOrder)
router.get('/my-orders',       protect,            getMyOrders)
router.get('/vendor-orders',   protect, authorize('vendor', 'admin'), getVendorOrders)
router.get('/stats/overview',  protect, authorize('admin'), getOrderStats)
router.get('/all',             protect, authorize('admin'), getAllOrders)
router.get('/:id',             protect,            getOrderById)
router.patch('/:id/cancel',    protect,            cancelOrder)
router.put('/:id/status',      protect, authorize('vendor', 'admin'), updateOrderStatus)
router.put('/:id/confirm-cod', protect, authorize('admin'), confirmCODPayment)

export default router