import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiShoppingBag, FiStar, FiClock, FiTruck, FiShield, FiSend } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../features/cart/cartSlice'
import axiosInstance from '../api/axiosInstance'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import IceCreamCard from '../components/IceCreamCard'

const ProductDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState(null)
  
  // Review form
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/products/${id}`)
        setProduct(res.data.product)
        setSelectedSize(res.data.product.sizes?.[1] || res.data.product.sizes?.[0] || { label: 'standard', price: res.data.product.basePrice })
        
        // Fetch related products
        const relatedRes = await axiosInstance.get(`/products/category/${res.data.product.category}`)
        setRelated(relatedRes.data.products.filter(p => p._id !== id).slice(0, 4))
      } catch (error) {
        toast.error('Failed to load product')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (!product.inStock) return
    dispatch(addToCart({
      _id: product._id,
      name: product.name,
      price: selectedSize.price,
      size: selectedSize.label,
      image: product.image,
      toppings: []
    }))
    toast.success('Added to cart!')
  }

  const handleAddReview = async (e) => {
    e.preventDefault()
    if (!user) return toast.error('Please login to leave a review')
    if (!comment) return toast.error('Please add a comment')
    
    setSubmitting(true)
    try {
      const res = await axiosInstance.post(`/products/${id}/reviews`, { rating, comment })
      setProduct(res.data.product)
      setComment('')
      toast.success('Review added!')
    } catch (error) {
      toast.error('Failed to add review')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-light flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="text-5xl">🍦</motion.div>
    </div>
  )

  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8 font-bold text-sm uppercase tracking-widest">
          <FiArrowLeft /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Image Container */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-square bg-white rounded-[3rem] overflow-hidden shadow-soft group"
          >
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-9xl">🍦</div>
            )}
            <div className="absolute top-8 left-8 flex flex-col gap-3">
              <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm">
                {product.category}
              </span>
              {product.isFeatured && (
                <span className="bg-primary text-white px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-glow">
                  Featured
                </span>
              )}
            </div>
          </motion.div>

          {/* Right: Product Details */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-2 text-primary font-black text-sm uppercase tracking-[0.3em] mb-2">
              <FiStar fill="currentColor" /> {product.ratings.average.toFixed(1)} ({product.ratings.count} Reviews)
            </div>
            <h1 className="text-5xl font-black text-dark mb-4 leading-tight">{product.name}</h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              {product.description || "Indulge in our premium, handcrafted ice cream made with the finest ingredients for a perfect sweet moment."}
            </p>

            {/* Price & Sizes */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-soft border border-gray-50 mb-8">
              <div className="flex items-end gap-3 mb-6">
                <span className="text-4xl font-black text-primary">₹{selectedSize.price}</span>
                <span className="text-gray-400 font-bold mb-1 uppercase tracking-widest text-xs">per {selectedSize.label}</span>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Select Portion Size</label>
                <div className="flex gap-3">
                  {product.sizes?.map(size => (
                    <button
                      key={size.label}
                      onClick={() => setSelectedSize(size)}
                      className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                        selectedSize.label === size.label 
                        ? 'bg-primary text-white shadow-glow' 
                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <button 
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-[2] bg-dark text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-black transition-all shadow-hard active:scale-95 disabled:opacity-50"
              >
                {product.inStock ? 'Add to Shopping Bag' : 'Out of Stock'}
              </button>
              <div className="flex-1 bg-white border border-gray-100 flex items-center justify-center rounded-[2rem] font-black text-dark">
                {product.inStock ? '15-20 min' : '--'}
              </div>
            </div>

            {/* Perks */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-orange-50/50 rounded-3xl">
                <FiTruck className="mx-auto text-primary mb-2" />
                <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Fast Delivery</p>
              </div>
              <div className="text-center p-4 bg-orange-50/50 rounded-3xl">
                <FiShield className="mx-auto text-primary mb-2" />
                <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Safe Packaging</p>
              </div>
              <div className="text-center p-4 bg-orange-50/50 rounded-3xl">
                <FiClock className="mx-auto text-primary mb-2" />
                <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Fresh Stock</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-black text-dark mb-6">Customer Reviews</h3>
            <div className="bg-white rounded-[2rem] p-8 shadow-soft sticky top-24">
              <p className="text-5xl font-black text-primary mb-2">{product.ratings.average.toFixed(1)}</p>
              <div className="flex gap-1 text-primary mb-4 text-xl">
                {[1,2,3,4,5].map(s => (
                  <FiStar key={s} fill={s <= Math.round(product.ratings.average) ? "currentColor" : "none"} />
                ))}
              </div>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-8">Based on {product.ratings.count} feed-backs</p>

              <form onSubmit={handleAddReview} className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Leave Your Rating</label>
                <div className="flex gap-2 mb-4">
                  {[1,2,3,4,5].map(s => (
                    <button 
                      key={s} type="button" 
                      onClick={() => setRating(s)}
                      className={`text-2xl transition-all ${rating >= s ? 'text-primary scale-110' : 'text-gray-200'}`}
                    >
                      <FiStar fill={rating >= s ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
                <textarea 
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Tell us about your experience..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[120px]"
                />
                <button 
                  disabled={submitting}
                  className="w-full bg-primary text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-glow hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                >
                  <FiSend /> {submitting ? 'Sending...' : 'Post Review'}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {product.reviews.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-12 text-center border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold italic">No reviews yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              product.reviews.map((review, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-[2rem] p-6 shadow-soft flex gap-4"
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-primary font-black uppercase">
                    {review.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-black text-dark uppercase tracking-widest text-[10px]">{review.name}</h4>
                      <div className="flex text-primary text-xs">
                        {[1,2,3,4,5].map(s => <FiStar key={s} fill={s <= review.rating ? "currentColor" : "none"} />)}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm font-medium leading-relaxed">{review.comment}</p>
                    <p className="text-[9px] text-gray-300 font-bold uppercase mt-2 tracking-tighter">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mb-20">
            <h3 className="text-2xl font-black text-dark mb-8">Related Creations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(p => (
                <IceCreamCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default ProductDetail
