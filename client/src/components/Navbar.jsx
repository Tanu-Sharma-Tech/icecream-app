import { useState }                   from 'react'
import { Link, useNavigate }          from 'react-router-dom'
import { useSelector, useDispatch }   from 'react-redux'
import { motion, AnimatePresence }    from 'framer-motion'
import { logoutUser }                 from '../features/auth/authSlice'
import toast                          from 'react-hot-toast'

const Navbar = () => {
  const { user }        = useSelector(state => state.auth)
  const { totalItems }  = useSelector(state => state.cart)
  const dispatch        = useDispatch()
  const navigate        = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await dispatch(logoutUser())
    toast.success('Logged out!')
    navigate('/login')
    setMenuOpen(false)
  }

  const navLinks = [
    { to: '/',      label: 'Home' },
    { to: '/shop',  label: 'Shop' },
    ...(user ? [{ to: '/orders', label: 'Orders' }] : []),
    ...(user?.role === 'admin'  ? [{ to: '/admin',  label: 'Admin' }] : []),
    ...(user?.role === 'vendor' ? [{ to: '/vendor', label: 'My Store' }] : []),
  ]

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-3xl">🍦</span>
            <span className="text-xl font-bold text-primary hidden sm:block">IceCream</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 rounded-xl text-gray-600 hover:text-primary hover:bg-orange-50 transition-all font-medium text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-orange-50 rounded-xl transition-all">
              <span className="text-2xl">🛒</span>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </motion.span>
              )}
            </Link>

            {/* Desktop Auth */}
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-dark leading-tight">
                    {user.name?.split(' ')[0]}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="border-2 border-primary text-primary px-4 py-1.5 rounded-full font-medium hover:bg-primary hover:text-white transition-all text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login"
                  className="border-2 border-primary text-primary px-4 py-1.5 rounded-full font-medium hover:bg-primary hover:text-white transition-all text-sm">
                  Login
                </Link>
                <Link to="/register"
                  className="bg-primary text-white px-4 py-1.5 rounded-full font-medium hover:bg-orange-600 transition-all text-sm">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-all"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className={`block h-0.5 bg-dark transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`block h-0.5 bg-dark transition-all ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 bg-dark transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-gray-600 hover:text-primary hover:bg-orange-50 transition-all font-medium"
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-gray-100 pt-3 mt-3">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-4 py-2">
                      <p className="font-semibold text-dark">{user.name}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/login" onClick={() => setMenuOpen(false)}
                      className="flex-1 text-center border-2 border-primary text-primary py-2.5 rounded-xl font-medium hover:bg-primary hover:text-white transition-all">
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setMenuOpen(false)}
                      className="flex-1 text-center bg-primary text-white py-2.5 rounded-xl font-medium hover:bg-orange-600 transition-all">
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar