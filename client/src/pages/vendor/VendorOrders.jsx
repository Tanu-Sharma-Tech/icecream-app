import { useState, useEffect } from 'react'
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

const VendorOrders = () => {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get('/orders/my-orders')
      setOrders(res.data.orders || [])
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = d => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-sm">{orders.length} orders</p>
        <button onClick={fetchOrders} className="text-primary text-sm hover:underline">Refresh</button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-20 animate-pulse" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="font-bold text-dark mb-2">No orders yet</h3>
          <p className="text-gray-500 text-sm">Orders will appear here when customers place them</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-dark text-sm">
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-500">{order.user?.name} • {formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">₹{order.totalAmount}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.orderStatus]}`}>
                    {order.orderStatus?.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {order.items?.map((item, i) => (
                  <span key={i} className="text-xs bg-orange-50 text-orange-600 px-3 py-1 rounded-full">
                    {item.name} x{item.quantity}
                  </span>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                <span>📍 {order.deliveryAddress?.city}</span>
                <span>💵 {order.paymentMethod} — {order.paymentStatus}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VendorOrders