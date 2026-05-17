import { useState, useEffect }      from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch }   from 'react-redux'
import { motion, AnimatePresence }    from 'framer-motion'
import { FiSearch, FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, FiInstagram, FiYoutube } from 'react-icons/fi'
import { logoutUser }                 from '../features/auth/authSlice'
import toast                          from 'react-hot-toast'

const Navbar = () => {
  const { user }        = useSelector(state => state.auth)
  const { totalItems }  = useSelector(state => state.cart)
  const dispatch        = useDispatch()
  const navigate        = useNavigate()
  const location        = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/login')
    toast.success('Logged out!')
    setMenuOpen(false)
  }

  const navLinks = [
    { to: '/',      label: 'Home' },
    { to: '/shop',  label: 'Shop' },
    ...(user ? [
      { to: '/orders', label: 'Orders' },
      { to: '/profile', label: 'Account' }
    ] : []),
    ...(user?.role === 'admin'  ? [{ to: '/admin',  label: 'Admin' }] : []),
    ...(user?.role === 'vendor' ? [{ to: '/vendor', label: 'My Store' }] : []),
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-white/80 backdrop-blur-lg shadow-soft py-2' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              className="text-3xl filter drop-shadow-sm"
            >
              🍦
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-dark tracking-tighter leading-none font-serif italic">
                Sweet<span className="text-primary font-normal not-italic ml-1">Movement</span>
              </span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] leading-none mt-1">
                Luxury Creamery
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="relative px-4 py-2 group"
              >
                <span className={`text-sm font-bold tracking-tight transition-colors duration-300 ${
                  isActive(link.to) ? 'text-primary' : 'text-gray-600 group-hover:text-primary'
                }`}>
                  {link.label}
                </span>
                {isActive(link.to) && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Instagram */}
            <a 
              href="https://www.instagram.com/swee_tmovement/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-gray-600 hover:text-primary transition-colors hidden sm:block"
              title="Follow us on Instagram"
            >
              <FiInstagram size={20} />
            </a>

            {/* YouTube */}
            <a 
              href="https://www.youtube.com/channel/UCgx1tHHUTUuPb1CRcfNwF4g" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-gray-600 hover:text-red-500 transition-colors hidden sm:block"
              title="Subscribe on YouTube"
            >
              <FiYoutube size={22} />
            </a>

            {/* Search (Icon only for now) */}
            <button className="p-2 text-gray-600 hover:text-primary transition-colors hidden sm:block">
              <FiSearch size={20} />
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative p-2.5 bg-orange-50/50 rounded-2xl hover:bg-orange-100 transition-all group">
              <FiShoppingCart className="text-gray-700 group-hover:text-primary transition-colors" size={22} />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-glow border-2 border-white"
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </motion.span>
              )}
            </Link>

            {/* Desktop Auth */}
            {user ? (
              <div className="hidden md:flex items-center gap-3 ml-2 border-l border-gray-200 pl-5">
                <div className="text-right group-hover:opacity-80 transition-opacity">
                  <p 
                    className="text-xs font-black text-dark leading-none truncate max-w-[160px] cursor-default"
                    title={user.name}
                  >
                    {user.name}
                  </p>
                  <p className="text-[9px] text-primary font-black uppercase tracking-[0.2em] mt-1 flex justify-end items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                    {user.role}
                  </p>
                </div>
                
                <div className="relative group">
                  <div 
                    onClick={() => navigate('/profile')}
                    className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-primary p-0.5 shadow-soft cursor-pointer hover:scale-105 transition-transform"
                  >
                    <div className="w-full h-full rounded-[14px] bg-white overflow-hidden flex items-center justify-center">
                      {user?.profileImage ? (
                        <img src={user.profileImage} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <FiUser className="text-primary text-lg" />
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <FiLogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3 ml-4">
                <Link to="/login" className="text-sm font-bold text-gray-600 hover:text-primary transition-colors">
                  Login
                </Link>
                <Link to="/register"
                  className="bg-dark text-white px-6 py-2.5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-hard hover:bg-black transition-all active:scale-95">
                  Join Us
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2.5 bg-gray-50 rounded-2xl text-dark"
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="md:hidden fixed inset-x-0 top-[68px] bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-xl"
          >
            <div className="p-6 space-y-2">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-5 py-4 rounded-2xl font-bold transition-all ${
                    isActive(link.to) ? 'bg-primary text-white' : 'bg-gray-50 text-dark hover:bg-orange-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-6 border-t border-gray-100 mt-6">
                {user ? (
                  <div className="bg-gray-50 rounded-3xl p-5">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white text-xl font-bold overflow-hidden shadow-glow">
                        {user.profileImage ? <img src={user.profileImage} className="w-full h-full object-cover" /> : user.name[0]}
                      </div>
                      <div>
                        <p className="font-black text-dark">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 text-red-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-100 transition-all"
                    >
                      <FiLogOut /> Logout Account
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/login" onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center py-4 bg-gray-50 text-dark rounded-2xl font-bold hover:bg-gray-100">
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center py-4 bg-primary text-white rounded-2xl font-bold shadow-glow">
                      Sign Up
                    </Link>
                  </div>
                )}
                <div className="pt-8 flex items-center justify-center gap-6 border-t border-gray-100 mt-6">
                  <a href="https://www.instagram.com/swee_tmovement/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
                    <FiInstagram size={20} />
                  </a>
                  <a href="https://www.youtube.com/channel/UCgx1tHHUTUuPb1CRcfNwF4g" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                    <FiYoutube size={20} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar