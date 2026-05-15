import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const features = [
  { icon: '🍦', title: 'Premium Flavors',   desc: 'Over 20 handcrafted flavors made fresh daily' },
  { icon: '🎨', title: 'Build Your Own',    desc: 'Customize scoops, toppings and sizes' },
  { icon: '🚚', title: 'Fast Delivery',     desc: 'Hot delivered cold in under 45 minutes' },
  { icon: '💰', title: 'Cash on Delivery',  desc: 'Pay when your order arrives at your door' },
]

const flavors = [
  { name: 'Mango',       color: '#FFC107', emoji: '🥭' },
  { name: 'Chocolate',   color: '#795548', emoji: '🍫' },
  { name: 'Strawberry',  color: '#E91E63', emoji: '🍓' },
  { name: 'Vanilla',     color: '#FFF9C4', emoji: '🌟' },
  { name: 'Blueberry',   color: '#3F51B5', emoji: '🫐' },
  { name: 'Pistachio',   color: '#8BC34A', emoji: '🌿' },
]

const Home = () => {
  return (
    <div className="min-h-screen bg-light">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 flex flex-col md:flex-row items-center gap-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex-1"
        >
          <span className="bg-orange-100 text-primary px-4 py-1 rounded-full text-sm font-medium">
            Fresh Daily
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-dark mt-4 leading-tight">
            Life is Short,<br />
            <span className="text-primary">Eat More</span><br />
            Ice Cream!
          </h1>
          <p className="text-gray-500 mt-4 text-lg leading-relaxed">
            Discover handcrafted ice creams made with real ingredients.
            Build your perfect scoop with our interactive builder!
          </p>
          <div className="flex gap-4 mt-8">
            <Link to="/shop" className="btn-primary text-lg px-8 py-3">
              Order Now
            </Link>
            <Link to="/shop" className="btn-outline text-lg px-8 py-3">
              View Menu
            </Link>
          </div>
        </motion.div>

        {/* Animated Ice Cream */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, type: 'spring' }}
          className="flex-1 flex justify-center"
        >
          <div className="relative">
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="text-[180px] select-none"
            >
              🍦
            </motion.div>
            {/* Floating emojis */}
            {['🍓', '🥭', '🍫', '🫐'].map((emoji, i) => (
              <motion.div
                key={i}
                className="absolute text-3xl"
                style={{
                  top:  `${[10, 70, 20, 60][i]}%`,
                  left: `${[10, 80, 75, 5][i]}%`,
                }}
                animate={{
                  y:       [0, -10, 0],
                  rotate:  [0, 10, -10, 0],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2 + i * 0.5,
                  repeat:   Infinity,
                  delay:    i * 0.3,
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="section-title text-center">Why Choose Us?</h2>
          <p className="section-subtitle text-center">We make every scoop count</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-dark text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Flavors */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <h2 className="section-title text-center">Popular Flavors</h2>
        <p className="section-subtitle text-center">Pick your favorite</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {flavors.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-md"
                style={{ backgroundColor: f.color + '33' }}
              >
                {f.emoji}
              </div>
              <span className="font-medium text-dark text-sm">{f.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-20 px-6 mx-4 md:mx-8 mb-16 overflow-hidden rounded-[2.5rem] group shadow-xl">
        {/* Background Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-orange-500 to-primary transition-transform duration-700 group-hover:scale-105" />
        
        {/* Abstract Decorative Shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/5 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />

        {/* Floating Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { e: '🍦', t: '10%', l: '10%', d: 0 },
            { e: '🍨', t: '20%', r: '15%', d: 1 },
            { e: '🍧', b: '15%', l: '20%', d: 0.5 },
            { e: '🧁', b: '20%', r: '10%', d: 1.5 },
            { e: '🍒', t: '50%', l: '5%', d: 0.8 },
            { e: '🍫', b: '40%', r: '5%', d: 1.2 },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl md:text-5xl opacity-20 md:opacity-40 filter grayscale-[0.2]"
              style={{ 
                top: item.t, left: item.l, right: item.r, bottom: item.b 
              }}
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 15, -15, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4 + i, 
                repeat: Infinity, 
                delay: item.d,
                ease: "easeInOut"
              }}
            >
              {item.e}
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Ready to <span className="italic font-serif">Order?</span>
            </h2>
            <p className="text-orange-50 mb-10 text-lg md:text-xl font-medium max-w-lg mx-auto leading-relaxed">
              Experience the art of the perfect scoop. Build your masterpiece and have it delivered in minutes.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 bg-white text-primary font-black px-12 py-5 rounded-3xl text-lg uppercase tracking-widest shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
              Start Building <span className="text-2xl">→</span>
            </Link>
          </motion.div>
        </div>
      </section>

          <Footer />
      {/* Footer */}
      {/* <footer className="bg-dark text-gray-400 py-8 text-center">
        <div className="text-3xl mb-2">🍦</div>
        <p className="font-medium text-white">IceCream App</p>
        <p className="text-sm mt-1">Made with love for ice cream lovers</p>
      </footer> */}
    </div>
  )
}

export default Home