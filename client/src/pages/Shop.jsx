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
    p.name.toLowerCase().includes(search.toLowerCase()) && p.inStock
  )

  return (
    <div className="min-h-screen bg-light">
      <Navbar />

      {/* Header */}
      <div className="bg-white pt-28 pb-10 px-4 text-center shadow-sm">
        <h1 className="text-4xl font-bold text-dark mb-2">Our Ice Cream Menu</h1>
        <p className="text-gray-500">Fresh, handcrafted flavors made daily</p>

        {/* Search */}
        <div className="max-w-md mx-auto mt-8 relative group">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Find your favorite flavor..."
            className="w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] py-4 pl-14 pr-6 text-sm font-bold focus:outline-none focus:border-primary/30 focus:bg-white focus:shadow-medium transition-all"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-[3rem] border-2 border-dashed border-gray-100">
            <div className="text-6xl mb-4">🍦</div>
            <h3 className="text-xl font-black text-dark tracking-tight">No flavors found</h3>
            <p className="text-gray-500 mt-2 font-medium">Try searching for something else or explore other categories.</p>
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