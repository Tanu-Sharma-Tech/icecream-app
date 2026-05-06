import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import axiosInstance from '../../api/axiosInstance'

const AdminInventory = () => {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [editing,  setEditing]  = useState(null)
  const [form,     setForm]     = useState({ stockQuantity: 0, inStock: true })

  useEffect(() => { fetchInventory() }, [])

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-sm">{products.length} products</p>
        <button onClick={fetchInventory} className="text-primary text-sm hover:underline">Refresh</button>
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
                {['Product', 'Category', 'Stock', 'Status', 'Vendor', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🍦</span>
                      <span className="font-medium text-dark">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 capitalize">{product.category}</td>
                  <td className="px-4 py-3">
                    {editing === product._id ? (
                      <input
                        type="number"
                        value={form.stockQuantity}
                        onChange={e => setForm({ ...form, stockQuantity: Number(e.target.value) })}
                        className="w-20 border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-primary"
                      />
                    ) : (
                      <span className={`font-bold ${product.stockQuantity < 10 ? 'text-red-500' : 'text-dark'}`}>
                        {product.stockQuantity}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editing === product._id ? (
                      <select
                        value={form.inStock}
                        onChange={e => setForm({ ...form, inStock: e.target.value === 'true' })}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none"
                      >
                        <option value="true">In Stock</option>
                        <option value="false">Out of Stock</option>
                      </select>
                    ) : (
                      <span className={`text-xs px-2 py-1 rounded-full ${product.inStock ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {product.vendor?.storeName || 'No vendor'}
                  </td>
                  <td className="px-4 py-3">
                    {editing === product._id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(product._id)}
                          className="text-xs bg-primary text-white px-3 py-1 rounded-lg hover:bg-orange-600 transition-all"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditing(null)}
                          className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-lg hover:bg-gray-200 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-primary text-xs font-medium hover:underline"
                      >
                        Edit Stock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-2">🏪</p>
              <p>No products found</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminInventory