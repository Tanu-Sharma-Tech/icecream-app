import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { addToCart } from '../features/cart/cartSlice'
import toast from 'react-hot-toast'

const flavors = [
  { name: 'Mango',      color: '#FFC107', emoji: '🥭' },
  { name: 'Chocolate',  color: '#795548', emoji: '🍫' },
  { name: 'Strawberry', color: '#E91E63', emoji: '🍓' },
  { name: 'Vanilla',    color: '#FFF176', emoji: '⭐' },
  { name: 'Blueberry',  color: '#5C6BC0', emoji: '🫐' },
  { name: 'Pistachio',  color: '#8BC34A', emoji: '🌿' },
  { name: 'Rose',       color: '#F48FB1', emoji: '🌹' },
  { name: 'Orange',     color: '#FF7043', emoji: '🍊' },
]

const toppings = [
  { name: 'Sprinkles', emoji: '✨', price: 20 },
  { name: 'Nuts',      emoji: '🥜', price: 30 },
  { name: 'Cherry',    emoji: '🍒', price: 15 },
  { name: 'Wafer',     emoji: '🍪', price: 25 },
  { name: 'Sauce',     emoji: '🍯', price: 20 },
  { name: 'Oreo',      emoji: '⚫', price: 35 },
]

const sizes = [
  { label: 'small',  scoops: 1, price: 80,  display: 'S' },
  { label: 'medium', scoops: 2, price: 120, display: 'M' },
  { label: 'large',  scoops: 3, price: 160, display: 'L' },
]

const ScoopBuilder = ({ product }) => {
  const [selectedFlavors,  setSelectedFlavors]  = useState([flavors[0]])
  const [selectedToppings, setSelectedToppings] = useState([])
  const [selectedSize,     setSelectedSize]     = useState(sizes[1])
  const dispatch = useDispatch()

  const maxScoops = selectedSize.scoops

  const toggleFlavor = (flavor) => {
    const exists = selectedFlavors.find(f => f.name === flavor.name)
    if (exists) {
      if (selectedFlavors.length === 1) return toast.error('Select at least 1 flavor!')
      setSelectedFlavors(prev => prev.filter(f => f.name !== flavor.name))
    } else {
      if (selectedFlavors.length >= maxScoops) {
        setSelectedFlavors(prev => [...prev.slice(1), flavor])
      } else {
        setSelectedFlavors(prev => [...prev, flavor])
      }
    }
  }

  const toggleTopping = (topping) => {
    const exists = selectedToppings.find(t => t.name === topping.name)
    if (exists) {
      setSelectedToppings(prev => prev.filter(t => t.name !== topping.name))
    } else {
      setSelectedToppings(prev => [...prev, topping])
    }
  }

  const totalPrice = selectedSize.price +
    selectedToppings.reduce((sum, t) => sum + t.price, 0)

  const handleAddToCart = () => {
    const cartItem = {
      _id:      product?._id || 'custom-' + Date.now(),
      name:     product?.name || 'Custom IceCream',
      size:     selectedSize.label,
      flavors:  selectedFlavors.map(f => f.name),
      toppings: selectedToppings.map(t => t.name),
      price:    totalPrice,
      image:    product?.image || '',
    }
    dispatch(addToCart(cartItem))
    toast.success('Added to cart!')
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-dark text-center mb-6">
        Build Your Perfect Scoop
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* LEFT — Ice Cream Preview */}
        <div className="flex flex-col items-center justify-center bg-orange-50 rounded-2xl p-8 min-h-64">
          <div className="relative flex flex-col items-center">
            {/* Scoops */}
            <AnimatePresence>
              {selectedFlavors.map((flavor, i) => (
                <motion.div
                  key={flavor.name + i}
                  initial={{ scale: 0, y: -20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-lg -mb-4"
                  style={{ backgroundColor: flavor.color }}
                >
                  {flavor.emoji}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Toppings */}
            {selectedToppings.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-1 mt-2"
              >
                {selectedToppings.map(t => (
                  <span key={t.name} className="text-xl">{t.emoji}</span>
                ))}
              </motion.div>
            )}

            {/* Cone */}
            <div className="text-7xl mt-2">🍦</div>
          </div>

          {/* Price */}
          <motion.div
            key={totalPrice}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="mt-4 text-3xl font-bold text-primary"
          >
            ₹{totalPrice}
          </motion.div>
          <p className="text-gray-400 text-sm mt-1">
            {selectedFlavors.map(f => f.name).join(' + ')}
          </p>
        </div>

        {/* RIGHT — Options */}
        <div className="space-y-6">

          {/* Size */}
          <div>
            <h3 className="font-bold text-dark mb-3">Choose Size</h3>
            <div className="flex gap-3">
              {sizes.map(size => (
                <button
                  key={size.label}
                  onClick={() => {
                    setSelectedSize(size)
                    setSelectedFlavors(prev => prev.slice(0, size.scoops))
                  }}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                    selectedSize.label === size.label
                      ? 'bg-primary text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-orange-50'
                  }`}
                >
                  <div className="text-lg">{size.display}</div>
                  <div className="text-xs">{size.scoops} scoop{size.scoops > 1 ? 's' : ''}</div>
                  <div className="text-xs">₹{size.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Flavors */}
          <div>
            <h3 className="font-bold text-dark mb-3">
              Choose Flavor{maxScoops > 1 ? 's' : ''} ({selectedFlavors.length}/{maxScoops})
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {flavors.map(flavor => {
                const selected = selectedFlavors.find(f => f.name === flavor.name)
                return (
                  <motion.button
                    key={flavor.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleFlavor(flavor)}
                    className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                      selected ? 'ring-2 ring-primary bg-orange-50' : 'bg-gray-50 hover:bg-orange-50'
                    }`}
                  >
                    <span className="text-2xl">{flavor.emoji}</span>
                    <span className="text-xs font-medium mt-1 text-center leading-tight">
                      {flavor.name}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Toppings */}
          <div>
            <h3 className="font-bold text-dark mb-3">Add Toppings (optional)</h3>
            <div className="grid grid-cols-3 gap-2">
              {toppings.map(topping => {
                const selected = selectedToppings.find(t => t.name === topping.name)
                return (
                  <motion.button
                    key={topping.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleTopping(topping)}
                    className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                      selected ? 'ring-2 ring-primary bg-orange-50' : 'bg-gray-50 hover:bg-orange-50'
                    }`}
                  >
                    <span className="text-xl">{topping.emoji}</span>
                    <span className="text-xs font-medium">{topping.name}</span>
                    <span className="text-xs text-primary">+₹{topping.price}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Add to Cart */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg"
          >
            Add to Cart — ₹{totalPrice}
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default ScoopBuilder