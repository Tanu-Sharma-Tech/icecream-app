import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import axiosInstance from '../../api/axiosInstance'
import AdminUsers from './AdminUsers'
import AdminOrders from './AdminOrders'
import AdminInventory from './AdminInventory'
import AdminVendors from './AdminVendors'
import AdminPayments from './AdminPayments'

const StatCard = ({ icon, label, value, color, sub }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white rounded-2xl p-5 shadow-sm"
  >
    <div className="flex items-center justify-between mb-3">
      <span className="text-3xl">{icon}</span>
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${color}`}>{sub}</span>
    </div>
    <p className="text-2xl font-bold text-dark">{value}</p>
    <p className="text-gray-500 text-sm mt-1">{label}</p>
  </motion.div>
)

const tabs = [
  { key: 'overview',   label: 'Overview',   emoji: '📊' },
  { key: 'orders',     label: 'Orders',     emoji: '📦' },
  { key: 'users',      label: 'Users',      emoji: '👥' },
  { key: 'inventory',  label: 'Inventory',  emoji: '🏪' },
  { key: 'vendors',    label: 'Vendors',    emoji: '🤝' },
  { key: 'payments',   label: 'Payments',   emoji: '💰' },
]

const AdminDashboard = () => {
  const { user }            = useSelector(state => state.auth)
  const navigate            = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats]   = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [lowStock, setLowStock]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
      return
    }
    fetchDashboard()
  }, [user])

  const fetchDashboard = async () => {
    try {
      const res = await axiosInstance.get('/admin/dashboard')
      setStats(res.data.stats)
      setRecentOrders(res.data.recentOrders)
      setLowStock(res.data.lowStockProducts)
    } catch {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const statusColor = {
    placed:           'bg-blue-100   text-blue-600',
    confirmed:        'bg-yellow-100 text-yellow-600',
    preparing:        'bg-orange-100 text-orange-600',
    out_for_delivery: 'bg-purple-100 text-purple-600',
    delivered:        'bg-green-100  text-green-600',
    cancelled:        'bg-red-100    text-red-500',
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} bg-dark text-white transition-all duration-300 flex flex-col sticky top-0 h-screen`}>
        {/* Logo */}
        <div className="p-4 flex items-center gap-3 border-b border-gray-700">
          <span className="text-2xl flex-shrink-0">🍦</span>
          {sidebarOpen && <span className="font-bold text-lg">IceCream Admin</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-all text-left ${
                activeTab === tab.key
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="text-xl flex-shrink-0">{tab.emoji}</span>
              {sidebarOpen && <span className="font-medium text-sm">{tab.label}</span>}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
          >
            <span className="text-xl">🏠</span>
            {sidebarOpen && <span className="text-sm">Back to Site</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">

        {/* Top Bar */}
        <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-dark transition-colors text-xl"
            >
              ☰
            </button>
            <h1 className="font-bold text-dark text-lg capitalize">
              {tabs.find(t => t.key === activeTab)?.emoji}{' '}
              {tabs.find(t => t.key === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-dark">{user?.name}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="p-6">

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl h-28 animate-pulse" />
                  ))}
                </div>
              ) : (
                <>
                  {/* Stat Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard icon="👥" label="Total Users"     value={stats?.totalUsers}     color="bg-blue-100 text-blue-600"   sub="Users" />
                    <StatCard icon="🍦" label="Total Products"  value={stats?.totalProducts}  color="bg-orange-100 text-orange-600" sub="Products" />
                    <StatCard icon="📦" label="Total Orders"    value={stats?.totalOrders}    color="bg-purple-100 text-purple-600" sub="Orders" />
                    <StatCard icon="🤝" label="Total Vendors"   value={stats?.totalVendors}   color="bg-green-100 text-green-600"  sub="Vendors" />
                    <StatCard icon="💰" label="Total Revenue"   value={`₹${stats?.totalRevenue}`}   color="bg-green-100 text-green-600"  sub="Revenue" />
                    <StatCard icon="⏳" label="Pending Orders"  value={stats?.pendingOrders}  color="bg-yellow-100 text-yellow-600" sub="Pending" />
                    <StatCard icon="✅" label="Delivered"       value={stats?.deliveredOrders} color="bg-green-100 text-green-600"  sub="Done" />
                    <StatCard icon="❌" label="Cancelled"       value={stats?.cancelledOrders} color="bg-red-100 text-red-500"     sub="Cancelled" />
                  </div>

                  {/* Recent Orders + Low Stock */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Recent Orders */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-dark">Recent Orders</h3>
                        <button
                          onClick={() => setActiveTab('orders')}
                          className="text-primary text-sm hover:underline"
                        >
                          View all
                        </button>
                      </div>
                      <div className="space-y-3">
                        {recentOrders.length === 0 ? (
                          <p className="text-gray-400 text-sm text-center py-4">No orders yet</p>
                        ) : recentOrders.map(order => (
                          <div key={order._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                            <div>
                              <p className="font-medium text-dark text-sm">
                                #{order._id.slice(-6).toUpperCase()}
                              </p>
                              <p className="text-xs text-gray-500">{order.user?.name}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary text-sm">₹{order.totalAmount}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[order.orderStatus]}`}>
                                {order.orderStatus.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Low Stock */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-dark">Low Stock Alert</h3>
                        <button
                          onClick={() => setActiveTab('inventory')}
                          className="text-primary text-sm hover:underline"
                        >
                          Manage
                        </button>
                      </div>
                      <div className="space-y-3">
                        {lowStock.length === 0 ? (
                          <div className="text-center py-4">
                            <p className="text-3xl mb-2">✅</p>
                            <p className="text-gray-400 text-sm">All products well stocked!</p>
                          </div>
                        ) : lowStock.map(product => (
                          <div key={product._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">🍦</span>
                              <div>
                                <p className="font-medium text-dark text-sm">{product.name}</p>
                                <p className="text-xs text-gray-500">
                                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                                </p>
                              </div>
                            </div>
                            <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                              product.stockQuantity < 5
                                ? 'bg-red-100 text-red-500'
                                : 'bg-yellow-100 text-yellow-600'
                            }`}>
                              {product.stockQuantity} left
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* Other Tabs */}
          {activeTab === 'orders'    && <AdminOrders />}
          {activeTab === 'users'     && <AdminUsers />}
          {activeTab === 'inventory' && <AdminInventory />}
          {activeTab === 'vendors'   && <AdminVendors />}
          {activeTab === 'payments'  && <AdminPayments />}
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard