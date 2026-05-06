import express from 'express'
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  getAllOrders,
  getOrderStats,
  confirmCODPayment,
} from '../controllers/orderController.js'
import { protect }   from '../middleware/authMiddleware.js'
import { adminOnly } from '../middleware/roleGuard.js'

const router = express.Router()

router.post('/',               protect,            placeOrder)
router.get('/my-orders',       protect,            getMyOrders)
router.get('/stats/overview',  protect, adminOnly, getOrderStats)
router.get('/all',             protect, adminOnly, getAllOrders)
router.get('/:id',             protect,            getOrderById)
router.put('/:id/cancel',      protect,            cancelOrder)
router.put('/:id/status',      protect, adminOnly, updateOrderStatus)
router.put('/:id/confirm-cod', protect, adminOnly, confirmCODPayment)

export default router