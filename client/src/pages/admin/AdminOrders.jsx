import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import axiosInstance from '../../api/axiosInstance'

const statusColors = {
  placed:           'bg-blue-100 text-blue-600',
  confirmed:        'bg-yellow-100 text-yellow-600',
  preparing:        'bg-orange-100 text-orange-600',
  out_for_delivery: 'bg-purple-100 text-purple-600',
  delivered:        'bg-green-100 text-green-600',
  cancelled:        'bg-red-100 text-red-500',
}

const AdminOrders = () => {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState('')
  const [updating, setUpdating] = useState(null)

  useEffect(() => { fetchOrders() }, [filter])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = filter ? `?status=${filter}` : ''
      const res    = await axiosInstance.get(`/admin/dashboard`)
      const all    = await axiosInstance.get(`/orders/all${params}`)
      setOrders(all.data.orders)
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

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
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['', 'placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].map(s => (
          <button key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
              filter === s ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-orange-50'
            }`}
          >
            {s === '' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-20 animate-pulse" />)}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-xs text-dark">
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-dark">{order.user?.name}</p>
                    <p className="text-xs text-gray-400">{order.user?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                  </td>
                  <td className="px-4 py-3 font-bold text-primary">₹{order.totalAmount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.orderStatus]}`}>
                      {order.orderStatus?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    <select
                      onChange={e => updateStatus(order._id, e.target.value)}
                      value={order.orderStatus}
                      disabled={updating === order._id}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-primary"
                    >
                      {['placed','confirmed','preparing','out_for_delivery','delivered','cancelled'].map(s => (
                        <option key={s} value={s}>{s.replace('_',' ')}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-2">📦</p>
              <p>No orders found</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminOrders