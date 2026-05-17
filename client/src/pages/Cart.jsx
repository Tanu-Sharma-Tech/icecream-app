import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import { removeFromCart, updateQuantity, clearCart } from '../features/cart/cartSlice'
import { placeOrder } from '../features/orders/orderSlice'
import Footer from '../components/Footer'

const Cart = () => {
  const { items, totalAmount } = useSelector(state => state.cart)
  const { user }               = useSelector(state => state.auth)
  const { isLoading }          = useSelector(state => state.orders)
  const dispatch               = useDispatch()

  const [step, setStep]       = useState(1) // 1=cart, 2=address, 3=success
  const [address, setAddress] = useState({
    name:    user?.name    || '',
    phone:   user?.phone   || '',
    street:  '',
    city:    '',
    state:   '',
    pincode: '',
  })

  const deliveryCharge = totalAmount > 500 ? 0 : 40
  const grandTotal     = totalAmount + deliveryCharge

  const handleAddressChange = e => {
    setAddress({ ...address, [e.target.name]: e.target.value })
  }

  const handlePlaceOrder = async () => {
    const { name, phone, street, city, state, pincode } = address
    if (!name || !phone || !street || !city || !state || !pincode) {
      return toast.error('Please fill all address fields')
    }

    const orderData = {
      items: items.map(item => ({
        productId: item._id.startsWith('custom-') ? null : item._id,
        quantity:  item.quantity,
        size:      item.size || 'medium',
        toppings:  item.toppings || [],
      })).filter(item => item.productId),
      deliveryAddress: address,
      notes: '',
    }

    if (orderData.items.length === 0) {
      return toast.error('No valid products to order. Please add products from the shop!')
    }

    dispatch(placeOrder(orderData)).then(res => {
      if (res.meta.requestStatus === 'fulfilled') {
        dispatch(clearCart())
        setStep(3)
      } else {
        toast.error(res.payload || 'Order failed')
      }
    })
  }

  // Empty cart
  if (items.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen bg-light">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring' }}
            className="text-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-9xl mb-6"
            >
              🛒
            </motion.div>
            <h2 className="text-2xl font-bold text-dark mb-2">Your cart is empty!</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Looks like you have not added any delicious ice creams yet!
            </p>
            <Link to="/shop" className="btn-primary text-base px-10 py-3">
              Browse Menu
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }
  

  return (
    <div className="min-h-screen bg-light">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 pt-32 pb-12">

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {['Cart', 'Address', 'Success'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step > i + 1 ? 'bg-green-500 text-white'
                : step === i + 1 ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-400'
              }`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`font-medium text-sm hidden md:block ${step === i + 1 ? 'text-primary' : 'text-gray-400'}`}>
                {s}
              </span>
              {i < 2 && <div className={`h-0.5 w-8 md:w-16 ${step > i + 1 ? 'bg-green-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* STEP 1 — Cart Items */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-bold text-dark mb-4">Your Cart ({items.length} items)</h2>
              <AnimatePresence>
                {items.map(item => (
                  <motion.div
                    key={item._id + item.size}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white rounded-2xl p-4 flex gap-4 items-center shadow-sm"
                  >
                    {/* Image */}
                    <Link to={item._id.startsWith('custom-') ? '#' : `/product/${item._id}`} className="w-20 h-20 bg-orange-50 rounded-xl flex items-center justify-center text-4xl flex-shrink-0 overflow-hidden hover:scale-105 transition-transform">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                      ) : '🍦'}
                    </Link>

                    {/* Details */}
                    <div className="flex-1">
                      <Link to={item._id.startsWith('custom-') ? '#' : `/product/${item._id}`}>
                        <h3 className="font-bold text-dark hover:text-primary transition-colors cursor-pointer">{item.name}</h3>
                      </Link>
                      <p className="text-sm text-gray-500 capitalize">
                        Size: {item.size}
                        {item.toppings?.length > 0 && ` • ${item.toppings.join(', ')}`}
                      </p>
                      <p className="text-primary font-bold">₹{item.price}</p>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }))}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold hover:bg-orange-100 transition-all"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold hover:bg-orange-100 transition-all"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="font-bold text-dark">₹{item.price * item.quantity}</p>
                      <button
                        onClick={() => {
                          dispatch(removeFromCart(item._id))
                          toast.success('Item removed')
                        }}
                        className="text-red-400 text-xs hover:text-red-600 transition-colors mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h3 className="text-xl font-bold text-dark mb-4">Order Summary</h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className={deliveryCharge === 0 ? 'text-green-500 font-medium' : ''}>
                      {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                    </span>
                  </div>
                  {deliveryCharge > 0 && (
                    <p className="text-xs text-gray-400">Free delivery on orders above ₹500</p>
                  )}
                  <div className="border-t pt-3 flex justify-between font-bold text-dark text-lg">
                    <span>Total</span>
                    <span className="text-primary">₹{grandTotal}</span>
                  </div>
                </div>

                {/* COD Badge */}
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 mb-4 flex items-center gap-2">
                  <span className="text-2xl">💵</span>
                  <div>
                    <p className="font-medium text-dark text-sm">Cash on Delivery</p>
                    <p className="text-xs text-gray-500">Pay when order arrives</p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(2)}
                  className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-all"
                >
                  Proceed to Checkout
                </motion.button>

                <button
                  onClick={() => dispatch(clearCart())}
                  className="w-full text-gray-400 text-sm mt-3 hover:text-red-400 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 — Delivery Address */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-dark mb-6">Delivery Address</h2>

            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    name="name"
                    value={address.name}
                    onChange={handleAddressChange}
                    placeholder="Your full name"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    name="phone"
                    value={address.phone}
                    onChange={handleAddressChange}
                    placeholder="10-digit phone"
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  name="street"
                  value={address.street}
                  onChange={handleAddressChange}
                  placeholder="House no, street, area"
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    placeholder="City"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    placeholder="State"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input
                    name="pincode"
                    value={address.pincode}
                    onChange={handleAddressChange}
                    placeholder="6-digit pincode"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mt-4">
              <h3 className="font-bold text-dark mb-3">Order Summary</h3>
              {items.map(item => (
                <div key={item._id} className="flex justify-between text-sm text-gray-600 py-1">
                  <span>{item.name} x{item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t mt-3 pt-3 flex justify-between font-bold text-dark">
                <span>Total (COD)</span>
                <span className="text-primary">₹{grandTotal}</span>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border-2 border-gray-200 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-all"
              >
                Back to Cart
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePlaceOrder}
                disabled={isLoading}
                className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Placing Order...' : 'Place Order (COD)'}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* STEP 3 — Success */}
        {step === 3 && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-9xl mb-6"
            >
              🎉
            </motion.div>
            <h2 className="text-3xl font-bold text-dark mb-2">Order Placed!</h2>
            <p className="text-gray-500 mb-2 text-lg">
              Your ice cream is on its way!
            </p>
            <p className="text-gray-400 mb-8">
              Pay with cash when your order arrives
            </p>

            <div className="bg-orange-50 rounded-2xl p-6 max-w-sm mx-auto mb-8">
              <p className="font-bold text-dark mb-1">Payment Method</p>
              <p className="text-primary font-bold text-xl">Cash on Delivery</p>
              <p className="text-gray-500 text-sm mt-1">Keep ₹{grandTotal} ready</p>
            </div>

            <div className="flex gap-4 justify-center">
              <Link to="/orders" className="btn-primary px-8 py-3 text-lg">
                Track Order
              </Link>
              <Link to="/shop" className="btn-outline px-8 py-3 text-lg">
                Order More
              </Link>
            </div>
          </motion.div>
          
        )}
        

        

      </div>
      <Footer />
    </div>
  )
}

export default Cart