import { useState }      from 'react'
import { motion }        from 'framer-motion'
import { useDispatch }   from 'react-redux'
import { addToCart }     from '../features/cart/cartSlice'
import toast             from 'react-hot-toast'

const IceCreamCard = ({ product }) => {
  const dispatch       = useDispatch()
  const [added, setAdded] = useState(false)
  const [selectedSize, setSelectedSize] = useState(
    product.sizes?.[1] || product.sizes?.[0] || null
  )

  const price = selectedSize?.price || product.basePrice

  const handleAddToCart = () => {
    if (!product.inStock) return
    dispatch(addToCart({
      _id:   product._id,
      name:  product.name,
      price,
      size:  selectedSize?.label || 'medium',
      image: product.image,
      toppings: [],
    }))
    setAdded(true)
    toast.success(`${product.name} added!`)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 400 }}
      className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-medium transition-shadow"
    >
      {/* Image */}
      <div className="relative bg-gradient-to-br from-orange-50 to-yellow-50 h-48 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="text-7xl"
          >
            🍦
          </motion.div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1">
          {product.isFeatured && (
            <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full font-medium">
              ⭐ Featured
            </span>
          )}
          {!product.inStock && (
            <span className="bg-gray-800 text-white text-xs px-2 py-0.5 rounded-full font-medium">
              Out of Stock
            </span>
          )}
        </div>

        {/* Category */}
        <div className="absolute top-3 right-3">
          <span className="bg-white text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium capitalize shadow-sm">
            {product.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-dark text-base mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-gray-400 text-xs mb-3 line-clamp-2">{product.description}</p>

        {/* Flavors */}
        {product.flavors?.length > 0 && (
          <div className="flex gap-1 mb-3 flex-wrap">
            {product.flavors.slice(0, 3).map((f, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: (f.color || '#F97316') + '22', color: f.color || '#F97316' }}
              >
                {f.name}
              </span>
            ))}
            {product.flavors.length > 3 && (
              <span className="text-xs text-gray-400">+{product.flavors.length - 3}</span>
            )}
          </div>
        )}

        {/* Size Picker */}
        {product.sizes?.length > 0 && (
          <div className="flex gap-1.5 mb-4">
            {product.sizes.map(size => (
              <button
                key={size.label}
                onClick={() => setSelectedSize(size)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                  selectedSize?.label === size.label
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-orange-50'
                }`}
              >
                {size.label[0].toUpperCase()}<br />
                <span className="text-xs">₹{size.price}</span>
              </button>
            ))}
          </div>
        )}

        {/* Price + Button */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-xl font-bold text-primary">₹{price}</span>
            {product.sizes?.length > 0 && (
              <span className="text-gray-400 text-xs ml-1 capitalize">{selectedSize?.label}</span>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              added
                ? 'bg-green-500 text-white'
                : product.inStock
                  ? 'bg-primary text-white hover:bg-orange-600'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {added ? '✓ Added!' : product.inStock ? 'Add to Cart' : 'Unavailable'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default IceCreamCard