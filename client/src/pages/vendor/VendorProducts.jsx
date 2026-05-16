import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiX, FiCamera, FiEdit2, FiTrash2, FiBox, FiDollarSign, FiTag, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'
import axiosInstance from '../../api/axiosInstance'

const VendorProducts = ({ products, onRefresh }) => {
  const [showAdd,  setShowAdd]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [preview,   setPreview]   = useState('')

  const [form, setForm] = useState({
    name: '', description: '', category: 'icecream',
    basePrice: '', stockQuantity: 50,
    priceS: 80, priceM: 120, priceL: 160
  })

  // Filter States
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStock, setFilterStock] = useState('all')

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory
    const matchesStock = filterStock === 'all' || (filterStock === 'instock' ? p.inStock : !p.inStock)
    return matchesSearch && matchesCategory && matchesStock
  })

  const [editForm, setEditForm] = useState({
    name: '', description: '', category: '',
    basePrice: '', stockQuantity: '', inStock: true,
    priceS: 80, priceM: 120, priceL: 160
  })

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    console.log('File Selected:', file)
    if (file) {
      setImageFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleCreate = async e => {
    e.preventDefault()
    if (!form.name || !form.priceM) return toast.error('Please fill required fields')
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('description', form.description)
      formData.append('category', form.category)
      formData.append('stockQuantity', form.stockQuantity)
      formData.append('basePrice', form.priceM)

      const sizes = [
        { label: 'small',  price: Number(form.priceS) },
        { label: 'medium', price: Number(form.priceM) },
        { label: 'large',  price: Number(form.priceL) }
      ]
      formData.append('sizes',    JSON.stringify(sizes))
      formData.append('flavors',  JSON.stringify([{name:form.name, color:'#FF7043'}]))
      formData.append('toppings', JSON.stringify([]))

      if (imageFile) formData.append('image', imageFile)
      
      const res = await axiosInstance.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      await axiosInstance.post(`/vendors/my/products/${res.data.product._id}`)
      
      toast.success('Product added successfully!')
      setShowAdd(false)
      resetForm()
      onRefresh()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product')
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (product) => {
    setEditingId(product._id)
    const sPrice = product.sizes?.find(s => s.label === 'small')?.price || product.basePrice || 80
    const mPrice = product.sizes?.find(s => s.label === 'medium')?.price || product.basePrice || 120
    const lPrice = product.sizes?.find(s => s.label === 'large')?.price || product.basePrice || 160

    setEditForm({
      name: product.name,
      description: product.description,
      category: product.category,
      basePrice: product.basePrice,
      stockQuantity: product.stockQuantity,
      inStock: product.inStock,
      priceS: sPrice,
      priceM: mPrice,
      priceL: lPrice
    })
    setPreview(product.image)
    setImageFile(null)
    setShowAdd(false) // Hide add form if open
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', editForm.name)
      formData.append('description', editForm.description)
      formData.append('category', editForm.category)
      formData.append('stockQuantity', editForm.stockQuantity)
      formData.append('inStock', editForm.inStock)
      formData.append('basePrice', editForm.priceM) // Set basePrice to Medium

      const sizes = [
        { label: 'small',  price: Number(editForm.priceS) },
        { label: 'medium', price: Number(editForm.priceM) },
        { label: 'large',  price: Number(editForm.priceL) }
      ]
      formData.append('sizes', JSON.stringify(sizes))
      formData.append('flavors', JSON.stringify([{ name: editForm.name, color: '#FF7043' }]))

      if (imageFile) {
        formData.append('image', imageFile)
      }

      await axiosInstance.put(`/products/${editingId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Product updated!')
      setEditingId(null)
      resetForm()
      onRefresh()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update product')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm({ name: '', description: '', category: 'icecream', basePrice: '', stockQuantity: 50, priceS: 80, priceM: 120, priceL: 160 })
    setPreview('')
    setImageFile(null)
    setEditingId(null)
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
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-soft border border-gray-50">
        <div>
          <h2 className="text-lg font-black text-dark leading-tight">Product Inventory</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{products.length} Items Listed</p>
        </div>
        <button
          onClick={() => { setShowAdd(!showAdd); setEditingId(null); resetForm() }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 text-sm ${
            showAdd ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' : 'bg-primary text-white shadow-glow hover:bg-orange-600'
          }`}
        >
          {showAdd ? <FiX /> : <FiPlus />}
          {showAdd ? 'Cancel' : 'Add New Item'}
        </button>
      </div>

      <AnimatePresence>
        {(showAdd || editingId) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-[2rem] p-8 shadow-medium border border-gray-100"
          >
            <h3 className="text-xl font-black text-dark mb-6 flex items-center gap-2">
              {editingId ? <FiEdit2 className="text-primary" /> : <FiPlus className="text-primary" />}
              {editingId ? 'Edit Product' : 'Create New Product'}
            </h3>
            
            <form onSubmit={editingId ? handleUpdate : handleCreate} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Product Image</label>
                  <div className="relative group aspect-square rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all hover:border-primary/50">
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <FiCamera className="mx-auto text-3xl text-gray-300 mb-2" />
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Click to upload</p>
                      </div>
                    )}
                    <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                    {preview && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <FiCamera className="text-white text-2xl" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Info Fields */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Product Name</label>
                    <input 
                      value={editingId ? editForm.name : form.name} 
                      onChange={e => editingId ? setEditForm({...editForm, name: e.target.value}) : setForm({...form, name: e.target.value})}
                      placeholder="e.g. Belgian Chocolate" 
                      className="input-field-new" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Category</label>
                    <select 
                      value={editingId ? editForm.category : form.category} 
                      onChange={e => editingId ? setEditForm({...editForm, category: e.target.value}) : setForm({...form, category: e.target.value})}
                      className="input-field-new"
                    >
                      {['icecream','sundae','milkshake','popsicle','waffle','other'].map(c => (
                        <option key={c} value={c}>{c.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>


                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Stock Quantity</label>
                    <div className="relative">
                      <FiBox className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                      <input 
                        type="number" 
                        value={editingId ? editForm.stockQuantity : form.stockQuantity} 
                        onChange={e => editingId ? setEditForm({...editForm, stockQuantity: e.target.value}) : setForm({...form, stockQuantity: e.target.value})}
                        className="input-field-new pl-10" 
                        placeholder="50" 
                      />
                    </div>
                  </div>

                  {/* Size Prices */}
                  <div className="md:col-span-2 grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Price (S)</label>
                      <input 
                        type="number" 
                        value={editingId ? editForm.priceS : form.priceS} 
                        onChange={e => editingId ? setEditForm({...editForm, priceS: e.target.value}) : setForm({...form, priceS: e.target.value})}
                        className="input-field-new" 
                        placeholder="S" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Price (M)</label>
                      <input 
                        type="number" 
                        value={editingId ? editForm.priceM : form.priceM} 
                        onChange={e => editingId ? setEditForm({...editForm, priceM: e.target.value}) : setForm({...form, priceM: e.target.value})}
                        className="input-field-new" 
                        placeholder="M" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Price (L)</label>
                      <input 
                        type="number" 
                        value={editingId ? editForm.priceL : form.priceL} 
                        onChange={e => editingId ? setEditForm({...editForm, priceL: e.target.value}) : setForm({...form, priceL: e.target.value})}
                        className="input-field-new" 
                        placeholder="L" 
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
                    <textarea 
                      value={editingId ? editForm.description : form.description} 
                      onChange={e => editingId ? setEditForm({...editForm, description: e.target.value}) : setForm({...form, description: e.target.value})}
                      placeholder="Describe your delicious creation..." 
                      className="input-field-new min-h-[100px] py-4" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-dark text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black shadow-hard transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? 'Processing...' : (editingId ? 'Update Product' : 'Launch Product')}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-50 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Search Products</label>
          <input 
            type="text" 
            placeholder="Search by name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field-new"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Category</label>
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="input-field-new"
          >
            <option value="all">ALL CATEGORIES</option>
            {['icecream','sundae','milkshake','popsicle','waffle','other'].map(c => (
              <option key={c} value={c}>{c.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Stock Status</label>
          <div className="flex gap-2">
            {['all', 'instock', 'outstock'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStock(s)}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filterStock === s 
                  ? 'bg-dark text-white shadow-hard' 
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                }`}
              >
                {s === 'outstock' ? 'Out' : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map((product, i) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group bg-white rounded-[2.5rem] p-4 shadow-soft border border-gray-50 hover:shadow-medium transition-all relative overflow-hidden"
          >
            {/* Image Section */}
            <div className="relative h-48 rounded-[2rem] overflow-hidden mb-4 bg-orange-50">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">🍦</div>
              )}
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm backdrop-blur-md ${
                  product.inStock ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'
                }`}>
                  {product.inStock ? 'In Stock' : 'Sold Out'}
                </span>
                <span className="bg-white/90 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm text-dark">
                  {product.category}
                </span>
              </div>
            </div>

            {/* Info Section */}
            <div className="px-2 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-black text-dark text-lg leading-tight truncate max-w-[150px]">{product.name}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">ID: #{product._id.slice(-6).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="text-primary font-black text-xl">₹{product.basePrice}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{product.stockQuantity} Left</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => startEdit(product)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-50 text-gray-600 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95"
                >
                  <FiEdit2 /> Edit
                </button>
                <button
                  onClick={() => toggleAvailability(product._id)}
                  className={`p-3 rounded-2xl transition-all active:scale-95 ${
                    product.inStock ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white'
                  }`}
                >
                  {product.inStock ? <FiAlertCircle size={18} /> : <FiCheckCircle size={18} />}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        
        {products.length === 0 && !showAdd && (
          <div className="col-span-full py-20 text-center bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft text-5xl">🍦</div>
            <h3 className="text-dark font-black text-xl mb-2">Empty Freezer?</h3>
            <p className="text-gray-400 text-sm mb-6">Add your first delicious ice cream to start selling!</p>
            <button onClick={() => setShowAdd(true)} className="bg-primary text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs shadow-glow hover:bg-orange-600 transition-all">
              Add First Product
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default VendorProducts
