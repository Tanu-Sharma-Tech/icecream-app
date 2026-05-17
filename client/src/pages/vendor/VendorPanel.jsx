import { useState, useEffect } from 'react'
import { useNavigate }         from 'react-router-dom'
import { useSelector }         from 'react-redux'
import { motion }              from 'framer-motion'
import toast                   from 'react-hot-toast'
import axiosInstance           from '../../api/axiosInstance'
import VendorProducts          from './VendorProducts'
import VendorOrders            from './VendorOrders'
import VendorProfile           from './VendorProfile'

const tabs = [
  { key: 'overview',  label: 'Overview',  emoji: '📊' },
  { key: 'products',  label: 'Products',  emoji: '🍦' },
  { key: 'orders',    label: 'Orders',    emoji: '📦' },
  { key: 'profile',   label: 'Profile',   emoji: '🏪' },
]

const VendorPanel = () => {
  const { user }     = useSelector(state => state.auth)
  const navigate     = useNavigate()
  const [activeTab, setActiveTab]   = useState('overview')
  const [vendor,    setVendor]      = useState(null)
  const [products,  setProducts]    = useState([])
  const [loading,   setLoading]     = useState(true)
  const [noVendor,  setNoVendor]    = useState(false)

  const fetchVendorData = async () => {
    setLoading(true)
    try {
      const [vendorRes, productsRes] = await Promise.all([
        axiosInstance.get('/vendors/my/profile'),
        axiosInstance.get('/vendors/my/products'),
      ])
      setVendor(vendorRes.data.vendor)
      setProducts(productsRes.data.products)
    } catch (err) {
      if (err.response?.status === 404) {
        setNoVendor(true)
      } else {
        toast.error('Failed to load vendor data')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (user.role === 'admin') { navigate('/admin'); return }
    fetchVendorData()
  }, [user, navigate])

  // No vendor profile yet
  if (noVendor) {
    return <CreateVendorProfile onCreated={() => { setNoVendor(false); fetchVendorData() }} />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🍦</div>
          <p className="text-gray-500">Loading vendor panel...</p>
        </div>
      </div>
    )
  }

  const inStockCount    = products.filter(p => p.inStock).length
  const outOfStockCount = products.filter(p => !p.inStock).length

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className="w-56 bg-dark text-white flex flex-col sticky top-0 h-screen">
        <div className="p-4 flex items-center gap-3 border-b border-gray-700">
          <span className="text-2xl">🏪</span>
          <div>
            <p className="font-bold text-sm truncate">{vendor?.storeName}</p>
            <p className="text-xs text-gray-400">Vendor Panel</p>
          </div>
        </div>

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
              <span className="text-xl">{tab.emoji}</span>
              <span className="font-medium text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700 space-y-2">
          <div className={`text-xs px-3 py-1.5 rounded-lg ${vendor?.isApproved ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
            {vendor?.isApproved ? '✅ Approved' : '⏳ Pending Approval'}
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <span>🏠</span> Back to Site
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="font-bold text-dark text-lg">
            {tabs.find(t => t.key === activeTab)?.emoji}{' '}
            {tabs.find(t => t.key === activeTab)?.label}
          </h1>
          <div 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-all group"
          >
            <span className="text-sm text-gray-500 hidden md:block group-hover:text-primary transition-colors">{user?.name}</span>
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm shadow-glow group-hover:scale-110 transition-transform overflow-hidden">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.name?.[0]?.toUpperCase()
              )}
            </div>
          </div>
        </div>

        <div className="p-6">

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: '🍦', label: 'Total Products',   value: products.length,   color: 'bg-orange-100 text-orange-600' },
                  { icon: '✅', label: 'In Stock',          value: inStockCount,       color: 'bg-green-100 text-green-600' },
                  { icon: '❌', label: 'Out of Stock',      value: outOfStockCount,    color: 'bg-red-100 text-red-500' },
                  { icon: '📦', label: 'Total Orders',      value: vendor?.totalOrders || 0, color: 'bg-blue-100 text-blue-600' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-2xl p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">{stat.icon}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${stat.color}`}>
                        {stat.label}
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-dark">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Store Info */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-dark mb-4">Store Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <span className="text-gray-400 w-24">Store Name</span>
                      <span className="font-medium text-dark">{vendor?.storeName}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-400 w-24">Email</span>
                      <span className="font-medium text-dark">{vendor?.email}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-400 w-24">Phone</span>
                      <span className="font-medium text-dark">{vendor?.phone}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <span className="text-gray-400 w-24">City</span>
                      <span className="font-medium text-dark">{vendor?.address?.city}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-400 w-24">State</span>
                      <span className="font-medium text-dark">{vendor?.address?.state}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-400 w-24">Status</span>
                      <span className={`font-medium ${vendor?.isApproved ? 'text-green-500' : 'text-yellow-500'}`}>
                        {vendor?.isApproved ? 'Approved' : 'Pending Approval'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products preview */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-dark">Your Products</h3>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="text-primary text-sm hover:underline"
                  >
                    Manage All
                  </button>
                </div>
                {products.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-4xl mb-2">🍦</p>
                    <p className="text-sm">No products yet</p>
                    <button
                      onClick={() => setActiveTab('products')}
                      className="mt-3 text-primary text-sm hover:underline"
                    >
                      Add products
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {products.slice(0, 6).map(product => (
                      <div key={product._id} className="bg-orange-50 rounded-xl p-3 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">🍦</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-dark text-sm truncate">{product.name}</p>
                          <p className="text-xs text-primary font-black">₹{product.basePrice}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase flex-shrink-0 ${product.inStock ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                          {product.inStock ? 'In' : 'Out'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <VendorProducts
              products={products}
              vendorId={vendor?._id}
              onRefresh={fetchVendorData}
            />
          )}
          {activeTab === 'orders'  && <VendorOrders  />}
          {activeTab === 'profile' && <VendorProfile vendor={vendor} onRefresh={fetchVendorData} />}
        </div>
      </main>
    </div>
  )
}

// Create Vendor Profile Form
const CreateVendorProfile = ({ onCreated }) => {
  const { user } = useSelector(state => state.auth)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    storeName:   '',
    description: '',
    phone:       '',
    email:       user?.email || '',
    city:        '',
    state:       '',
    pincode:     '',
    street:      '',
  })

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.storeName || !form.phone || !form.city) {
      return toast.error('Please fill all required fields')
    }
    setLoading(true)
    try {
      await axiosInstance.post('/vendors', {
        storeName:   form.storeName,
        description: form.description,
        phone:       form.phone,
        email:       form.email,
        address:     JSON.stringify({ street: form.street, city: form.city, state: form.state, pincode: form.pincode }),
        deliveryAreas: '[]',
      })
      toast.success('Vendor profile created!')
      onCreated()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-light flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-lg"
      >
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">🏪</div>
          <h1 className="text-2xl font-bold text-dark">Create Vendor Profile</h1>
          <p className="text-gray-500 mt-1">Set up your ice cream store</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Name *</label>
            <input value={form.storeName} onChange={e => setForm({...form, storeName: e.target.value})}
              placeholder="My Ice Cream Store" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              placeholder="Best ice creams in town!" className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                placeholder="9876543210" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                placeholder="store@email.com" className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
            <input value={form.street} onChange={e => setForm({...form, street: e.target.value})}
              placeholder="123 Main Street" className="input-field" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                placeholder="Mumbai" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input value={form.state} onChange={e => setForm({...form, state: e.target.value})}
                placeholder="Maharashtra" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
              <input value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value})}
                placeholder="400001" className="input-field" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-all disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Store Profile'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default VendorPanel