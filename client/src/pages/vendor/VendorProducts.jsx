import { useState } from 'react'
import { motion }   from 'framer-motion'
import toast        from 'react-hot-toast'
import axiosInstance from '../../api/axiosInstance'

const VendorProducts = ({ products, onRefresh }) => {
  const [showAdd,  setShowAdd]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [form, setForm] = useState({
    name: '', description: '', category: 'icecream',
    basePrice: '', stockQuantity: 50,
  })

  const handleCreate = async e => {
    e.preventDefault()
    if (!form.name || !form.basePrice) return toast.error('Please fill required fields')
    setLoading(true)
    try {
      // Create product
      const res = await axiosInstance.post('/products', {
        ...form,
        basePrice:     Number(form.basePrice),
        stockQuantity: Number(form.stockQuantity),
        sizes:    '[{"label":"small","price":80},{"label":"medium","price":120},{"label":"large","price":160}]',
        flavors:  '[{"name":"Vanilla","color":"#FFF176"}]',
        toppings: '[{"name":"Sprinkles","price":20}]',
        isFeatured: false,
        inStock: true,
      })
      // Add product to vendor
      await axiosInstance.post(`/vendors/my/products/${res.data.product._id}`)
      toast.success('Product added!')
      setShowAdd(false)
      setForm({ name: '', description: '', category: 'icecream', basePrice: '', stockQuantity: 50 })
      onRefresh()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product')
    } finally {
      setLoading(false)
    }
  }

  const toggleAvailability = async (productId) => {
    try {
      const res = await axiosInstance.patch(`/vendors/my/products/${productId}/toggle`)
      toast.success(res.data.message)
      onRefresh()
    } catch {
      toast.error('Failed to toggle availability')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-sm">{products.length} products in your store</p>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-orange-600 transition-all text-sm"
        >
          {showAdd ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {/* Add Product Form */}
      {showAdd && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <h3 className="font-bold text-dark mb-4">Add New Product</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="Mango Delight" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                  className="input-field">
                  {['icecream','sundae','milkshake','popsicle','waffle'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                placeholder="Delicious ice cream..." className="input-field" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (₹) *</label>
                <input type="number" value={form.basePrice} onChange={e => setForm({...form, basePrice: e.target.value})}
                  placeholder="120" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                <input type="number" value={form.stockQuantity} onChange={e => setForm({...form, stockQuantity: e.target.value})}
                  placeholder="50" className="input-field" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-all disabled:opacity-50">
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </form>
        </motion.div>
      )}

      {/* Products List */}
      {products.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <div className="text-6xl mb-4">🍦</div>
          <h3 className="font-bold text-dark mb-2">No products yet</h3>
          <p className="text-gray-500 text-sm mb-4">Add your first ice cream product!</p>
          <button onClick={() => setShowAdd(true)}
            className="bg-primary text-white px-6 py-2 rounded-xl font-medium hover:bg-orange-600 transition-all">
            Add Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <motion.div
              key={product._id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl">
                    🍦
                  </div>
                  <div>
                    <h3 className="font-bold text-dark text-sm">{product.name}</h3>
                    <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${product.inStock ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className="space-y-1 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Base Price</span>
                  <span className="font-bold text-primary">₹{product.basePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Stock</span>
                  <span className="font-medium text-dark">{product.stockQuantity} units</span>
                </div>
              </div>

              <button
                onClick={() => toggleAvailability(product._id)}
                className={`w-full py-2 rounded-xl text-sm font-medium transition-all ${
                  product.inStock
                    ? 'bg-red-50 text-red-500 hover:bg-red-100'
                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                }`}
              >
                {product.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VendorProducts
