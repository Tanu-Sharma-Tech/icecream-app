import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import IceCreamCard from '../components/IceCreamCard'
import ScoopBuilder from '../components/ScoopBuilder'
import axiosInstance from '../api/axiosInstance'
import toast from 'react-hot-toast'
import Footer from '../components/Footer'
import SimpleLoader from '../components/SimpleLoader'

const categories = ['all', 'icecream', 'sundae', 'milkshake', 'popsicle', 'waffle']

const Shop = () => {
  const [products,  setProducts]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [category,  setCategory]  = useState('all')
  const [showBuilder, setShowBuilder] = useState(false)
  const [search,    setSearch]    = useState('')

  useEffect(() => {
    fetchProducts()
  }, [category])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = category !== 'all' ? `?category=${category}` : ''
      const res    = await axiosInstance.get(`/products${params}`)
      setProducts(res.data.products)
    } catch {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-light">
      <Navbar />

      {/* Header */}
      <div className="bg-white pt-28 pb-10 px-4 text-center shadow-sm">
        <h1 className="text-4xl font-bold text-dark mb-2">Our Ice Cream Menu</h1>
        <p className="text-gray-500">Fresh, handcrafted flavors made daily</p>

        {/* Search */}
        <div className="max-w-md mx-auto mt-6">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search flavors..."
            className="input-field"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Scoop Builder Toggle */}
        <div className="text-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowBuilder(!showBuilder)}
            className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg"
          >
            {showBuilder ? 'Hide Builder' : 'Build Your Own Scoop! '}
          </motion.button>
        </div>

        {/* Scoop Builder */}
        {showBuilder && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-12"
          >
            <ScoopBuilder />
          </motion.div>
        )}

        {/* Category Filter */}
        <div className="flex gap-3 overflow-x-auto pb-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 rounded-full font-medium whitespace-nowrap transition-all capitalize ${
                category === cat
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-orange-50 border border-gray-200'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="py-20">
            <SimpleLoader text="Finding perfect scoops..." />
          </div>
            ) : filtered.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍦</div>
            <h3 className="text-xl font-bold text-dark">No products found</h3>
            <p className="text-gray-500 mt-2">Try a different category or search term</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filtered.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <IceCreamCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        
        
      </div>
      <Footer />

      
    </div>
  )
}

export default Shop