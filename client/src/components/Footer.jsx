import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-dark text-gray-400">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-4xl">🍦</span>
              <span className="text-2xl font-bold text-white">IceCream</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Handcrafted ice creams made with love and real ingredients.
              Delivered fresh to your doorstep!
            </p>
            <div className="flex gap-3">
              {['📘', '📸', '🐦', '▶️'].map((icon, i) => (
                <button key={i}
                  className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary transition-all text-sm">
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/',      label: 'Home' },
                { to: '/shop',  label: 'Shop' },
                { to: '/cart',  label: 'Cart' },
                { to: '/orders',label: 'My Orders' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to}
                    className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span>📧</span> support@icecream.com
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span> +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <span>📍</span> Mumbai, Maharashtra
              </li>
              <li className="flex items-center gap-2">
                <span>🕐</span> 10 AM - 10 PM
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-center">
            © 2024 IceCream App. Made with ❤️ for ice cream lovers.
          </p>
          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer