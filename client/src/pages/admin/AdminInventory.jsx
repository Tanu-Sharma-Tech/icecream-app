import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiRefreshCw, FiEdit3, FiPackage, FiSave, FiX, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi'
import toast from 'react-hot-toast'
import axiosInstance from '../../api/axiosInstance'

const AdminInventory = () => {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [editing,  setEditing]  = useState(null)
  const [form,     setForm]     = useState({ stockQuantity: 0, inStock: true })

  const fetchInventory = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get('/admin/inventory')
      setProducts(res.data.products)
    } catch {
      toast.error('Failed to load inventory')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchInventory() }, [])

  const handleEdit = (product) => {
    setEditing(product._id)
    setForm({ stockQuantity: product.stockQuantity, inStock: product.inStock })
  }

  const handleUpdate = async (productId) => {
    try {
      await axiosInstance.put(`/admin/inventory/${productId}`, form)
      toast.success('Inventory updated!')
      setEditing(null)
      fetchInventory()
    } catch {
      toast.error('Failed to update')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="bg-white px-4 py-2 rounded-xl shadow-soft border border-gray-50 flex items-center gap-2">
          <FiPackage className="text-primary" />
          <p className="text-sm font-bold text-dark">{products.length} <span className="text-gray-400 font-medium">Products</span></p>
        </div>
        <button 
          onClick={fetchInventory} 
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-500 hover:text-primary rounded-xl shadow-soft border border-gray-50 transition-all active:scale-95 text-sm font-bold"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-3xl h-20 animate-pulse border border-gray-50 shadow-soft" />)}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-soft border border-gray-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-gray-400 font-bold uppercase tracking-wider text-[10px]">Product</th>
                  <th className="px-6 py-4 text-gray-400 font-bold uppercase tracking-wider text-[10px]">Category</th>
                  <th className="px-6 py-4 text-gray-400 font-bold uppercase tracking-wider text-[10px]">Stock Level</th>
                  <th className="px-6 py-4 text-gray-400 font-bold uppercase tracking-wider text-[10px]">Status</th>
                  <th className="px-6 py-4 text-gray-400 font-bold uppercase tracking-wider text-[10px]">Vendor</th>
                  <th className="px-6 py-4 text-gray-400 font-bold uppercase tracking-wider text-[10px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={product._id} 
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-xl shadow-sm border border-orange-100 group-hover:scale-110 transition-transform">
                          🍦
                        </div>
                        <span className="font-bold text-dark">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-gray-200">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {editing === product._id ? (
                        <input
                          type="number"
                          value={form.stockQuantity}
                          onChange={e => setForm({ ...form, stockQuantity: Number(e.target.value) })}
                          className="w-24 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold transition-all"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={`text-base font-black ${product.stockQuantity < 10 ? 'text-red-500' : 'text-dark'}`}>
                            {product.stockQuantity}
                          </span>
                          {product.stockQuantity < 10 && <FiAlertTriangle className="text-red-500 animate-pulse" />}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editing === product._id ? (
                        <select
                          value={form.inStock}
                          onChange={e => setForm({ ...form, inStock: e.target.value === 'true' })}
                          className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold transition-all cursor-pointer"
                        >
                          <option value="true">In Stock</option>
                          <option value="false">Out of Stock</option>
                        </select>
                      ) : (
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${product.inStock ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                          {product.inStock ? <FiCheckCircle /> : <FiX />}
                          {product.inStock ? 'In Stock' : 'Sold Out'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-medium">
                      <div className="text-[11px] bg-indigo-50/50 text-indigo-600 px-2 py-1 rounded-lg border border-indigo-100 inline-block">
                        {product.vendor?.storeName || 'Store Admin'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {editing === product._id ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleUpdate(product._id)}
                            className="p-2 bg-primary text-white rounded-lg hover:bg-orange-600 shadow-glow transition-all active:scale-90"
                            title="Save Changes"
                          >
                            <FiSave size={16} />
                          </button>
                          <button
                            onClick={() => setEditing(null)}
                            className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-all active:scale-90"
                            title="Cancel"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-gray-300 hover:text-primary hover:bg-orange-50 rounded-lg transition-all active:scale-90"
                          title="Edit Stock"
                        >
                          <FiEdit3 size={16} />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {products.length === 0 && (
            <div className="text-center py-20 bg-gray-50/30">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <FiPackage size={40} />
              </div>
              <h4 className="text-dark font-bold">No products found</h4>
              <p className="text-gray-400 text-xs mt-1">Inventory is currently empty</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminInventory