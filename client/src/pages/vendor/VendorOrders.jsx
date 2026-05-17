import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiShoppingBag, FiTruck, FiXCircle, FiRefreshCcw } from 'react-icons/fi'
import toast from 'react-hot-toast'
import axiosInstance from '../../api/axiosInstance'

const statusColors = {
  placed:           'bg-blue-50 text-blue-600 border-blue-100',
  confirmed:        'bg-yellow-50 text-yellow-600 border-yellow-100',
  preparing:        'bg-orange-50 text-orange-600 border-orange-100',
  out_for_delivery: 'bg-purple-50 text-purple-600 border-purple-100',
  delivered:        'bg-green-50 text-green-600 border-green-100',
  cancelled:        'bg-red-50 text-red-500 border-red-100',
}

const VendorOrders = () => {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get('/orders/vendor-orders')
      setOrders(res.data.orders || [])
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId)
    try {
      await axiosInstance.put(`/orders/${orderId}/status`, { status })
      toast.success(`Order ${status.replace('_', ' ')} successfully!`)
      fetchOrders()
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdating(null)
    }
  }

  const formatDate = d => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-dark tracking-tight">Order Management</h2>
          <p className="text-gray-500 text-xs font-medium">Handle your customer orders and tracking</p>
        </div>
        <button 
          onClick={fetchOrders} 
          className="p-2.5 bg-white border border-gray-100 rounded-xl text-primary hover:bg-orange-50 transition-all shadow-sm active:scale-90"
        >
          <FiRefreshCcw className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-[2rem] h-32 animate-pulse border border-gray-50" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-20 text-center shadow-soft border border-gray-50">
          <div className="text-7xl mb-6 grayscale opacity-20">📦</div>
          <h3 className="text-2xl font-black text-dark mb-2 italic font-serif">No orders yet</h3>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">When customers fall in love with your flavors, their orders will appear here!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order, i) => (
            <motion.div 
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-[2.5rem] p-6 shadow-soft border border-gray-50 hover:shadow-medium transition-all group relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-primary text-2xl shadow-sm group-hover:scale-110 transition-transform">
                    <FiShoppingBag />
                  </div>
                  <div>
                    <p className="font-black text-dark text-lg tracking-tighter">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                      {order.user?.name} • {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${statusColors[order.orderStatus]}`}>
                    {order.orderStatus.replace('_', ' ')}
                  </div>
                  <p className="text-2xl font-black text-primary tracking-tighter">₹{order.totalAmount}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 border border-gray-100 px-4 py-2 rounded-2xl flex items-center gap-2">
                    <span className="text-xs font-bold text-dark">{item.name}</span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-md border border-gray-100 font-black text-primary">x{item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-tighter">
                  <span className="flex items-center gap-1"><FiTruck /> {order.deliveryAddress?.city}</span>
                  <span className="flex items-center gap-1 font-black text-primary/60">💵 {order.paymentMethod}</span>
                </div>

                <div className="flex items-center gap-2">
                  {order.orderStatus === 'placed' && (
                    <button 
                      onClick={() => updateStatus(order._id, 'confirmed')}
                      disabled={updating === order._id}
                      className="px-6 py-2.5 bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-soft active:scale-95 disabled:opacity-50"
                    >
                      Confirm Order
                    </button>
                  )}
                  {order.orderStatus === 'confirmed' && (
                    <button 
                      onClick={() => updateStatus(order._id, 'preparing')}
                      disabled={updating === order._id}
                      className="px-6 py-2.5 bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-soft active:scale-95 disabled:opacity-50"
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.orderStatus === 'preparing' && (
                    <button 
                      onClick={() => updateStatus(order._id, 'out_for_delivery')}
                      disabled={updating === order._id}
                      className="px-6 py-2.5 bg-purple-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 transition-all shadow-soft active:scale-95 disabled:opacity-50"
                    >
                      Out for Delivery
                    </button>
                  )}
                  {order.orderStatus === 'out_for_delivery' && (
                    <button 
                      onClick={() => updateStatus(order._id, 'delivered')}
                      disabled={updating === order._id}
                      className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-soft active:scale-95 disabled:opacity-50"
                    >
                      Mark Delivered
                    </button>
                  )}
                  {['placed', 'confirmed'].includes(order.orderStatus) && (
                    <button 
                      onClick={() => updateStatus(order._id, 'cancelled')}
                      disabled={updating === order._id}
                      className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-soft active:scale-95 disabled:opacity-50"
                    >
                      <FiXCircle size={18} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VendorOrders