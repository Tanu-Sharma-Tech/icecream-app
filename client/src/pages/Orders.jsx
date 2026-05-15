import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import { getMyOrders } from '../features/orders/orderSlice'

const statusSteps = [
  { key: 'placed',            label: 'Order Placed',     emoji: '📋' },
  { key: 'confirmed',         label: 'Confirmed',        emoji: '✅' },
  { key: 'preparing',         label: 'Preparing',        emoji: '👨‍🍳' },
  { key: 'out_for_delivery',  label: 'Out for Delivery', emoji: '🚚' },
  { key: 'delivered',         label: 'Delivered',        emoji: '🎉' },
]

const statusColors = {
  placed:           'bg-blue-100   text-blue-600',
  confirmed:        'bg-yellow-100 text-yellow-600',
  preparing:        'bg-orange-100 text-orange-600',
  out_for_delivery: 'bg-purple-100 text-purple-600',
  delivered:        'bg-green-100  text-green-600',
  cancelled:        'bg-red-100    text-red-500',
}

const OrderTracker = ({ status }) => {
  const currentIndex = statusSteps.findIndex(s => s.key === status)
  const isCancelled  = status === 'cancelled'

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 bg-red-50 text-red-500 px-4 py-2 rounded-xl">
        <span className="text-xl">❌</span>
        <span className="font-medium">Order Cancelled</span>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center min-w-max gap-0">
        {statusSteps.map((step, i) => {
          const isDone    = i <= currentIndex
          const isCurrent = i === currentIndex
          return (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isCurrent ? 1.2 : 1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                    isDone
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step.emoji}
                </motion.div>
                <span className={`text-xs font-medium whitespace-nowrap ${
                  isDone ? 'text-primary' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
              {i < statusSteps.length - 1 && (
                <div className={`h-1 w-12 md:w-16 mx-1 rounded transition-all ${
                  i < currentIndex ? 'bg-primary' : 'bg-gray-200'
                }`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false)

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-bold text-dark text-sm">
                #{order._id.slice(-8).toUpperCase()}
              </span>
              <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${statusColors[order.orderStatus]}`}>
                {order.orderStatus.replace(/_/g, ' ')}
              </span>
              <span className="text-xs bg-orange-50 text-primary px-3 py-1 rounded-full font-medium">
                COD
              </span>
            </div>
            <p className="text-gray-500 text-xs mt-1">{formatDate(order.createdAt)}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {order.items.map((item, i) => (
                <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {item.name} x{item.quantity}
                </span>
              ))}
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <p className="font-bold text-primary text-lg">₹{order.totalAmount}</p>
            <p className="text-xs text-gray-400">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
            <span className="text-gray-400 text-xs">{expanded ? '▲' : '▼'}</span>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-100"
          >
            <div className="p-4 space-y-6">

              {/* Order Tracker */}
              <div>
                <h4 className="font-bold text-dark mb-4 text-sm">Order Status</h4>
                <OrderTracker status={order.orderStatus} />
              </div>

              {/* Items */}
              <div>
                <h4 className="font-bold text-dark mb-3 text-sm">Items Ordered</h4>
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-orange-50 rounded-xl p-3">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                        ) : '🍦'}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-dark text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500 capitalize">
                          {item.size} size
                          {item.toppings?.length > 0 && ` • ${item.toppings.join(', ')}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary text-sm">₹{item.price}</p>
                        <p className="text-xs text-gray-400">x{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-bold text-dark mb-3 text-sm">Price Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Items Total</span>
                    <span>₹{order.itemsPrice}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Charge</span>
                    <span className={order.deliveryCharge === 0 ? 'text-green-500' : ''}>
                      {order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-dark border-t pt-2">
                    <span>Total Paid</span>
                    <span className="text-primary">₹{order.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Payment</span>
                    <span className="font-medium">
                      {order.paymentMethod} —{' '}
                      <span className={order.paymentStatus === 'paid' ? 'text-green-500' : 'text-orange-500'}>
                        {order.paymentStatus}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <h4 className="font-bold text-dark mb-2 text-sm">Delivery Address</h4>
                <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600">
                  <p className="font-medium text-dark">{order.deliveryAddress?.name}</p>
                  <p>{order.deliveryAddress?.phone}</p>
                  <p>{order.deliveryAddress?.street}</p>
                  <p>{order.deliveryAddress?.city}, {order.deliveryAddress?.state} — {order.deliveryAddress?.pincode}</p>
                </div>
              </div>

              {/* Status History */}
              {order.statusHistory?.length > 0 && (
                <div>
                  <h4 className="font-bold text-dark mb-2 text-sm">Status History</h4>
                  <div className="space-y-2">
                    {order.statusHistory.map((h, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        <span className="capitalize font-medium text-dark">
                          {h.status.replace('_', ' ')}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {formatDate(h.timestamp)}
                        </span>
                        {h.note && (
                          <span className="text-gray-500 text-xs">— {h.note}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {order.notes && (
                <div className="bg-yellow-50 rounded-xl p-3 text-sm">
                  <span className="font-medium text-dark">Note: </span>
                  <span className="text-gray-600">{order.notes}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const Orders = () => {
  const dispatch              = useDispatch()
  const { orders, isLoading } = useSelector(state => state.orders)
  const [filter, setFilter]   = useState('all')

  useEffect(() => {
    dispatch(getMyOrders())
  }, [dispatch])

  const filtered = filter === 'all'
    ? orders
    : orders.filter(o => o.orderStatus === filter)

  return (
    <div className="min-h-screen bg-light">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-28 pb-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black text-dark tracking-tight">My Orders</h1>
            <p className="text-gray-500 mt-1 font-medium">{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
          </div>
          <button
            onClick={() => dispatch(getMyOrders())}
            className="w-fit px-4 py-2 bg-white border border-gray-100 rounded-xl text-primary hover:bg-orange-50 font-bold text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <span className="text-lg">🔄</span> Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {['all', 'placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
                filter === f
                  ? 'bg-primary text-white shadow-glow'
                  : 'bg-white text-gray-500 hover:bg-orange-50 border border-gray-100'
              }`}
            >
              {f === 'all' ? 'All Orders' : f.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton h-32 w-full opacity-50" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-dark mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all' ? 'You have not placed any orders yet' : `No ${filter.replace('_', ' ')} orders`}
            </p>
            <a href="/shop" className="btn-primary px-8 py-3">
              Start Shopping
            </a>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filtered.map(order => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders