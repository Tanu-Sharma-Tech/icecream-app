import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { 
  FiPieChart, FiUsers, FiShoppingBag, FiDatabase, 
  FiTruck, FiDollarSign, FiMenu, FiHome, FiLogOut,
  FiTrendingUp, FiAlertCircle, FiCheckCircle, FiXCircle
} from 'react-icons/fi'
import axiosInstance from '../../api/axiosInstance'
import AdminUsers from './AdminUsers'
import AdminOrders from './AdminOrders'
import AdminInventory from './AdminInventory'
import AdminVendors from './AdminVendors'
import AdminPayments from './AdminPayments'

const StatCard = ({ icon: Icon, label, value, color, sub, trend }) => (
  <motion.div
    whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-3xl p-6 shadow-soft border border-gray-50 relative overflow-hidden group"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 transition-transform group-hover:scale-150 duration-500 ${color.split(' ')[0]}`} />
    
    <div className="flex items-center justify-between mb-4 relative z-10">
      <div className={`p-3 rounded-2xl ${color}`}>
        <Icon size={24} />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
        {sub}
      </span>
    </div>
    
    <div className="relative z-10">
      <h3 className="text-3xl font-bold text-dark tracking-tight">{value}</h3>
      <p className="text-gray-500 text-sm font-medium mt-1">{label}</p>
      {trend && (
        <div className="flex items-center gap-1 mt-3 text-green-500 text-xs font-bold">
          <FiTrendingUp />
          <span>{trend}</span>
        </div>
      )}
    </div>
  </motion.div>
)

const tabs = [
  { key: 'overview',   label: 'Overview',   icon: FiPieChart },
  { key: 'orders',     label: 'Orders',     icon: FiShoppingBag },
  { key: 'users',      label: 'Users',      icon: FiUsers },
  { key: 'inventory',  label: 'Inventory',  icon: FiDatabase },
  { key: 'vendors',    label: 'Vendors',    icon: FiTruck },
  { key: 'payments',   label: 'Payments',   icon: FiDollarSign },
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

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
      return
    }
    fetchDashboard()
  }, [user, navigate])

  const statusColor = {
    placed:           'bg-blue-50   text-blue-600 border border-blue-100',
    confirmed:        'bg-yellow-50 text-yellow-600 border border-yellow-100',
    preparing:        'bg-orange-50 text-orange-600 border border-orange-100',
    out_for_delivery: 'bg-purple-50 text-purple-600 border border-purple-100',
    delivered:        'bg-green-50  text-green-600 border border-green-100',
    cancelled:        'bg-red-50    text-red-500 border border-red-100',
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-poppins">

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-dark text-white transition-all duration-500 ease-in-out flex flex-col sticky top-0 h-screen z-30 shadow-hard`}>
        {/* Logo */}
        <div className="h-20 flex items-center px-6 gap-4 border-b border-gray-800/50">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-glow flex-shrink-0">
            <span className="text-2xl">🍦</span>
          </div>
          {sidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
            >
              IceCream.
            </motion.span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  activeTab === tab.key
                    ? 'bg-primary text-white shadow-glow'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                }`}
              >
                <Icon size={20} className={`${activeTab === tab.key ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`} />
                {sidebarOpen && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-semibold text-sm"
                  >
                    {tab.label}
                  </motion.span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-gray-800/50 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-white transition-all hover:bg-gray-800/50 rounded-2xl"
          >
            <FiHome size={20} />
            {sidebarOpen && <span className="text-sm font-medium">Back to Site</span>}
          </button>
          <button
             onClick={() => {
               localStorage.removeItem('accessToken')
               navigate('/login')
             }}
             className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:text-red-300 transition-all hover:bg-red-500/10 rounded-2xl"
          >
            <FiLogOut size={20} />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto h-screen custom-scrollbar">

        {/* Top Bar */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 h-20 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 bg-gray-50 rounded-xl text-gray-500 hover:text-primary transition-all hover:bg-orange-50 active:scale-95 shadow-sm"
            >
              <FiMenu size={20} />
            </button>
            <div>
              <h1 className="font-bold text-dark text-xl tracking-tight">
                {tabs.find(t => t.key === activeTab)?.label} Dashboard
              </h1>
              <p className="text-xs text-gray-400 font-medium hidden sm:block">Welcome back, {user?.name}</p>
            </div>
          </div>
          
          <div 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-4 bg-gray-50 p-1.5 pr-4 rounded-2xl border border-gray-100 cursor-pointer hover:border-primary/30 transition-all active:scale-95 group"
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-glow group-hover:scale-110 transition-transform overflow-hidden">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.name?.[0]?.toUpperCase()
              )}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-bold text-dark leading-none">{user?.name}</p>
              <p className="text-[10px] font-bold text-primary uppercase mt-1 tracking-wider">Super Admin</p>
            </div>
          </div>
        </div>

        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white rounded-3xl h-36 animate-pulse border border-gray-50" />
                      ))}
                    </div>
                  ) : (
                    <>
                      {/* Stat Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard icon={FiUsers} label="Total Users" value={stats?.totalUsers} color="bg-blue-500 text-white" sub="Users" trend="+12% this month" />
                        <StatCard icon={FiDatabase} label="Total Products" value={stats?.totalProducts} color="bg-orange-500 text-white" sub="Products" />
                        <StatCard icon={FiShoppingBag} label="Total Orders" value={stats?.totalOrders} color="bg-purple-500 text-white" sub="Orders" trend="+24% today" />
                        <StatCard icon={FiDollarSign} label="Total Revenue" value={`₹${stats?.totalRevenue?.toLocaleString()}`} color="bg-green-500 text-white" sub="Revenue" trend="+8% growth" />
                        <StatCard icon={FiAlertCircle} label="Pending Orders" value={stats?.pendingOrders} color="bg-yellow-500 text-white" sub="Pending" />
                        <StatCard icon={FiCheckCircle} label="Delivered" value={stats?.deliveredOrders} color="bg-emerald-500 text-white" sub="Completed" />
                        <StatCard icon={FiTruck} label="Total Vendors" value={stats?.totalVendors} color="bg-indigo-500 text-white" sub="Vendors" />
                        <StatCard icon={FiXCircle} label="Cancelled" value={stats?.cancelledOrders} color="bg-red-500 text-white" sub="Lost" />
                      </div>

                      {/* Recent Orders + Low Stock */}
                      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">

                        {/* Recent Orders */}
                        <div className="lg:col-span-4 bg-white rounded-3xl p-8 shadow-soft border border-gray-50">
                          <div className="flex items-center justify-between mb-8">
                            <div>
                              <h3 className="font-bold text-dark text-lg">Recent Transactions</h3>
                              <p className="text-xs text-gray-400 font-medium">Latest customer activity</p>
                            </div>
                            <button
                              onClick={() => setActiveTab('orders')}
                              className="px-4 py-2 bg-gray-50 text-primary text-xs font-bold rounded-xl hover:bg-orange-50 transition-colors border border-gray-100"
                            >
                              View All
                            </button>
                          </div>
                          <div className="space-y-4">
                            {recentOrders.length === 0 ? (
                              <div className="text-center py-12">
                                <p className="text-4xl grayscale opacity-20 mb-3">🛒</p>
                                <p className="text-gray-400 text-sm font-medium">No recent orders</p>
                              </div>
                            ) : recentOrders.map((order, i) => (
                              <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={order._id} 
                                className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 border border-transparent hover:border-gray-100 hover:bg-white transition-all group"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-lg font-bold group-hover:scale-110 transition-transform">
                                    {order.user?.name?.[0]}
                                  </div>
                                  <div>
                                    <p className="font-bold text-dark text-sm">
                                      #{order._id.slice(-6).toUpperCase()}
                                    </p>
                                    <p className="text-xs text-gray-500 font-medium">{order.user?.name}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-extrabold text-dark text-sm">₹{order.totalAmount}</p>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-tight mt-1 inline-block ${statusColor[order.orderStatus]}`}>
                                    {order.orderStatus.replace('_', ' ')}
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Low Stock */}
                        <div className="lg:col-span-3 bg-white rounded-3xl p-8 shadow-soft border border-gray-50">
                          <div className="flex items-center justify-between mb-8">
                            <div>
                              <h3 className="font-bold text-dark text-lg">Inventory Alerts</h3>
                              <p className="text-xs text-gray-400 font-medium">Critical stock levels</p>
                            </div>
                            <button
                              onClick={() => setActiveTab('inventory')}
                              className="px-4 py-2 bg-red-50 text-red-500 text-xs font-bold rounded-xl hover:bg-red-100 transition-colors border border-red-50"
                            >
                              Manage
                            </button>
                          </div>
                          <div className="space-y-4">
                            {lowStock.length === 0 ? (
                              <div className="text-center py-12 bg-green-50/30 rounded-3xl border border-dashed border-green-200">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✅</div>
                                <p className="text-green-600 font-bold text-sm">Inventory healthy!</p>
                                <p className="text-green-500/70 text-xs mt-1">All products are well stocked</p>
                              </div>
                            ) : lowStock.map((product, i) => (
                              <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={product._id} 
                                className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 hover:shadow-soft transition-all"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-xl">🍦</div>
                                  <div>
                                    <p className="font-bold text-dark text-sm line-clamp-1">{product.name}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                      {product.inStock ? 'Available' : 'Sold Out'}
                                    </p>
                                  </div>
                                </div>
                                <div className={`px-3 py-1 rounded-xl text-center border ${
                                  product.stockQuantity < 5
                                    ? 'bg-red-50 text-red-500 border-red-100'
                                    : 'bg-yellow-50 text-yellow-600 border-yellow-100'
                                }`}>
                                  <p className="text-xs font-bold leading-tight">{product.stockQuantity}</p>
                                  <p className="text-[8px] font-black uppercase tracking-tighter">Left</p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Other Tabs */}
              {activeTab === 'orders'    && <AdminOrders />}
              {activeTab === 'users'     && <AdminUsers />}
              {activeTab === 'inventory' && <AdminInventory />}
              {activeTab === 'vendors'   && <AdminVendors />}
              {activeTab === 'payments'  && <AdminPayments />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard