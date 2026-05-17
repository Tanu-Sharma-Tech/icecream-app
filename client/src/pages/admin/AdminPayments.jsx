import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiDollarSign, FiCreditCard, FiCheckCircle, FiClock, FiActivity, FiArrowUpRight } from 'react-icons/fi'
import toast from 'react-hot-toast'
import axiosInstance from '../../api/axiosInstance'

const AdminPayments = () => {
  const [orders,   setOrders]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [revenue,  setRevenue]  = useState(0)
  const [filter,   setFilter]   = useState('')

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

  useEffect(() => { fetchPayments() }, [filter])

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
    <div className="space-y-6">
      {/* Revenue Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 text-white shadow-hard relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <FiDollarSign size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
              <FiActivity />
            </div>
            <p className="text-white/80 text-sm font-bold uppercase tracking-widest">Total Revenue</p>
          </div>
          <div className="flex items-end gap-3">
            <p className="text-5xl font-black tracking-tighter">₹{revenue?.toLocaleString()}</p>
            <div className="flex items-center gap-1 text-green-300 text-xs font-bold mb-2 bg-white/10 px-2 py-1 rounded-lg">
              <FiArrowUpRight />
              <span>+14.2%</span>
            </div>
          </div>
          <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mt-4">Verified Earnings from Delivered Orders</p>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-soft border border-gray-50 max-w-fit">
        {[
          { val: '',        label: 'All Payments' },
          { val: 'pending', label: 'Pending' },
          { val: 'paid',    label: 'Paid' },
        ].map(f => (
          <button key={f.val}
            onClick={() => setFilter(f.val)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              filter === f.val 
                ? 'bg-primary text-white shadow-glow' 
                : 'bg-transparent text-gray-400 hover:text-dark hover:bg-gray-50'
            }`}
          >
            {f.label}
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
                  <th className="px-6 py-4 text-gray-400 font-bold uppercase tracking-wider text-[10px]">Reference</th>
                  <th className="px-6 py-4 text-gray-400 font-bold uppercase tracking-wider text-[10px]">Customer</th>
                  <th className="px-6 py-4 text-gray-400 font-bold uppercase tracking-wider text-[10px]">Amount</th>
                  <th className="px-6 py-4 text-gray-400 font-bold uppercase tracking-wider text-[10px]">Method</th>
                  <th className="px-6 py-4 text-gray-400 font-bold uppercase tracking-wider text-[10px]">Payment Status</th>
                  <th className="px-6 py-4 text-gray-400 font-bold uppercase tracking-wider text-[10px]">Date</th>
                  <th className="px-6 py-4 text-gray-400 font-bold uppercase tracking-wider text-[10px] text-right">Actions</th>
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
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100 font-black text-[10px]">
                          TXN
                        </div>
                        <p className="font-black text-dark tracking-tighter uppercase">#{order._id?.slice(-8)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-500">
                          {order.user?.name?.[0]}
                        </div>
                        <div>
                          <p className="font-bold text-dark text-xs">{order.user?.name}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{order.user?.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-dark italic">₹{order.totalAmount}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-gray-200">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        order.paymentStatus === 'paid'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {order.paymentStatus === 'paid' ? <FiCheckCircle /> : <FiClock />}
                        {order.paymentStatus}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-400 font-bold text-[11px]">{formatDate(order.createdAt)}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {order.paymentStatus === 'pending' && order.paymentMethod === 'COD' && (
                        <button
                          onClick={() => confirmCOD(order._id)}
                          className="px-4 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 shadow-glow transition-all active:scale-95"
                        >
                          Confirm
                        </button>
                      )}
                      {order.paymentStatus === 'paid' && (
                        <div className="flex items-center justify-end gap-1 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                          <FiCheckCircle />
                          <span>Verified</span>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && (
            <div className="text-center py-20 bg-gray-50/30">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <FiCreditCard size={40} />
              </div>
              <h4 className="text-dark font-bold">No payment records</h4>
              <p className="text-gray-400 text-xs mt-1">Transactions will appear here</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminPayments