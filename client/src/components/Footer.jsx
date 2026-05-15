import { Link } from 'react-router-dom'
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi'
import { motion } from 'framer-motion'

const Footer = () => {
  return (
    <footer className="bg-dark text-gray-400 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-orange-500/10 to-primary/10 rounded-[40px] p-8 md:p-12 mb-20 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-colors" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md text-center md:text-left">
              <h3 className="text-3xl font-black text-white mb-3 tracking-tight">Join the Sweet Side</h3>
              <p className="text-gray-400">Subscribe to get exclusive offers, new flavor alerts and ice cream tips!</p>
            </div>
            
            <div className="w-full max-w-md relative">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all pr-16"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-primary text-white w-12 rounded-xl flex items-center justify-center hover:bg-orange-600 transition-all shadow-glow active:scale-90">
                <FiSend size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">

          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-4xl">🍦</span>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white tracking-tighter leading-none font-serif italic">
                  Sweet<span className="text-primary font-normal not-italic ml-1">Movement</span>
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Crafting premium, handcrafted ice creams using only the finest organic ingredients. Experience the luxury of real cream.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <FiInstagram />, label: 'Instagram' },
                { icon: <FiTwitter />,   label: 'Twitter' },
                { icon: <FiFacebook />,  label: 'Facebook' },
                { icon: <FiYoutube />,   label: 'Youtube' },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -5 }}
                  className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all text-lg border border-white/5"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Navigation</h4>
            <ul className="space-y-4">
              {[
                { to: '/',      label: 'Home' },
                { to: '/shop',  label: 'Explore Shop' },
                { to: '/cart',  label: 'Your Basket' },
                { to: '/orders',label: 'Order History' },
                { to: '/profile',label: 'Account Settings' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to}
                    className="text-sm hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-primary/20 rounded-full group-hover:bg-primary transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories/Support */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Support</h4>
            <ul className="space-y-4">
              {[
                { label: 'Help Center' },
                { label: 'Delivery Info' },
                { label: 'Terms of Service' },
                { label: 'Privacy Policy' },
                { label: 'Refund Policy' },
              ].map(link => (
                <li key={link.label}>
                  <a href="#" className="text-sm hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-primary/20 rounded-full group-hover:bg-primary transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Contact Us</h4>
            <ul className="space-y-6 text-sm">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                  <FiMail size={16} />
                </div>
                <div>
                  <p className="text-white font-bold mb-1 italic">Email Support</p>
                  <p className="text-xs">hello@sweetmovement.com</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                  <FiPhone size={16} />
                </div>
                <div>
                  <p className="text-white font-bold mb-1 italic">Phone</p>
                  <p className="text-xs">+91 98765 43210</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                  <FiMapPin size={16} />
                </div>
                <div>
                  <p className="text-white font-bold mb-1 italic">Location</p>
                  <p className="text-xs">Marine Drive, Mumbai</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-xs text-center md:text-left tracking-tight">
              © 2026 Sweet Movement Creamery. All rights reserved.
            </p>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
              Developed with ❤️ for ice cream lovers
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-8 h-5 bg-white/5 border border-white/10 rounded flex items-center justify-center">
                  <div className="w-4 h-2 bg-white/20 rounded-sm" />
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-tighter">Safe & Secure Payments</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer