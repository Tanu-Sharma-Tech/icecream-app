import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiShoppingBag, FiClock, FiCheckCircle } from 'react-icons/fi'
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

const AdminOrders = () => {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState('')
  const [updating, setUpdating] = useState(null)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = filter ? `?status=${filter}` : ''
      const res    = await axiosInstance.get(`/orders/all${params}`)
      setOrders(res.data.orders)
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [filter])

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId)
    try {
      await axiosInstance.put(`/orders/${orderId}/status`, { status })
      toast.success(`Order updated to ${status}`)
      fetchOrders()
    } catch {
      toast.error('Failed to update order')
    } finally {
      setUpdating(null)
    }
  }

  const formatDate = d => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-2 flex-wrap bg-white p-2 rounded-2xl shadow-soft border border-gray-50">
        {['', 'placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].map(s => (
          <button key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              filter === s 
                ? 'bg-primary text-white shadow-glow' 
                : 'bg-transparent text-gray-400 hover:text-dark hover:bg-gray-50'
            }`}
          >
            {s === '' ? 'All Orders' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-3xl h-24 animate-pulse border border-gray-50 shadow-soft" />)}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-soft border border-gray-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-gray-400 font-bold uppercase tracking-wider text-[10px]">Order Details</th>
                  <th className="px-6 py-4 text-gray-400 font-bold uppercase tracking-wider text-[10px]">Customer</th>
                  <th className="px-6 py-4 text-gray-400 font-bold uppercase tracking-wider text-[10px]">Total Amount</th>
                  <th className="px-6 py-4 text-gray-400 font-bold uppercase tracking-wider text-[10px]">Status</th>
                  <th className="px-6 py-4 text-gray-400 font-bold uppercase tracking-wider text-[10px]">Date</th>
                  <th className="px-6 py-4 text-gray-400 font-bold uppercase tracking-wider text-[10px] text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={order._id} 
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100">
                          <FiShoppingBag size={20} />
                        </div>
                        <div>
                          <p className="font-black text-dark tracking-tighter">#{order._id.slice(-8).toUpperCase()}</p>
                          <p className="text-[10px] text-gray-400 font-bold">{order.items?.length} Items Ordered</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-500">
                          {order.user?.name?.[0]}
                        </div>
                        <div>
                          <p className="font-bold text-dark text-xs">{order.user?.name}</p>
                          <p className="text-[10px] text-gray-400 font-medium line-clamp-1">{order.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-primary">₹{order.totalAmount}</td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColors[order.orderStatus]}`}>
                        {order.orderStatus === 'delivered' ? <FiCheckCircle /> : <FiClock />}
                        {order.orderStatus?.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-500 font-bold text-[11px]">{formatDate(order.createdAt)}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        onChange={e => updateStatus(order._id, e.target.value)}
                        value={order.orderStatus}
                        disabled={updating === order._id}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all disabled:opacity-50"
                      >
                        {['placed','confirmed','preparing','out_for_delivery','delivered','cancelled'].map(s => (
                          <option key={s} value={s}>{s.replace('_',' ')}</option>
                        ))}
                      </select>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && (
            <div className="text-center py-20 bg-gray-50/30">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <FiShoppingBag size={40} />
              </div>
              <h4 className="text-dark font-bold">No orders found</h4>
              <p className="text-gray-400 text-xs mt-1">Order list is currently empty</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminOrders