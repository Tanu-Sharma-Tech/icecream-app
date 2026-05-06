import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import axiosInstance from '../../api/axiosInstance'

const AdminPayments = () => {
  const [orders,   setOrders]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [revenue,  setRevenue]  = useState(0)
  const [filter,   setFilter]   = useState('')

  useEffect(() => { fetchPayments() }, [filter])

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const params = filter ? `?paymentStatus=${filter}` : ''
      const res    = await axiosInstance.get(`/admin/payments${params}`)
      setOrders(res.data.orders)
      setRevenue(res.data.totalRevenue)
    } catch {
      toast.error('Failed to load payments')
    } finally {
      setLoading(false)
    }
  }

  const confirmCOD = async (orderId) => {
    try {
      await axiosInstance.put(`/orders/${orderId}/confirm-cod`)
      toast.success('COD payment confirmed!')
      fetchPayments()
    } catch {
      toast.error('Failed to confirm payment')
    }
  }

  const formatDate = d => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

  return (
    <div className="space-y-4">
      {/* Revenue Card */}
      <div className="bg-gradient-to-r from-orange-400 to-pink-400 rounded-2xl p-6 text-white">
        <p className="text-orange-100 text-sm font-medium">Total Revenue Collected</p>
        <p className="text-4xl font-bold mt-1">₹{revenue}</p>
        <p className="text-orange-100 text-xs mt-1">From delivered + paid orders</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { val: '',        label: 'All' },
          { val: 'pending', label: 'Pending' },
          { val: 'paid',    label: 'Paid' },
        ].map(f => (
          <button key={f.val}
            onClick={() => setFilter(f.val)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === f.val ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-orange-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-16 animate-pulse" />)}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Order ID', 'Customer', 'Amount', 'Method', 'Payment Status', 'Order Status', 'Date', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-dark">
                    #{order._id?.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-dark text-xs">{order.user?.name}</p>
                    <p className="text-xs text-gray-400">{order.user?.phone}</p>
                  </td>
                  <td className="px-4 py-3 font-bold text-primary">₹{order.totalAmount}</td>
                  <td className="px-4 py-3">
                    <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full font-medium">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      order.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-500 capitalize">
                      {order.orderStatus?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    {order.paymentStatus === 'pending' && order.paymentMethod === 'COD' && (
                      <button
                        onClick={() => confirmCOD(order._id)}
                        className="text-xs bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-all"
                      >
                        Confirm COD
                      </button>
                    )}
                    {order.paymentStatus === 'paid' && (
                      <span className="text-xs text-green-500 font-medium">Paid</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-2">💰</p>
              <p>No payment records found</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminPayments