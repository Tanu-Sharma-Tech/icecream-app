import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { FiChevronRight, FiHelpCircle, FiTruck, FiShield, FiFileText, FiDollarSign, FiArrowLeft } from 'react-icons/fi'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Support = () => {
  const { hash } = useLocation()
  const [activeTab, setActiveTab] = useState('help-center')

  useEffect(() => {
    if (hash) {
      const tab = hash.replace('#', '')
      if (['help-center', 'delivery-info', 'terms', 'privacy', 'refund'].includes(tab)) {
        setActiveTab(tab)
      }
    }
  }, [hash])

  const tabs = [
    { id: 'help-center', label: 'Help Center',    icon: <FiHelpCircle />, color: 'bg-blue-500' },
    { id: 'delivery-info', label: 'Delivery Info',  icon: <FiTruck />,      color: 'bg-orange-500' },
    { id: 'terms',        label: 'Terms of Service',icon: <FiFileText />,   color: 'bg-purple-500' },
    { id: 'privacy',      label: 'Privacy Policy',  icon: <FiShield />,     color: 'bg-emerald-500' },
    { id: 'refund',       label: 'Refund Policy',   icon: <FiDollarSign />, color: 'bg-red-500' },
  ]

  const content = {
    'help-center': {
      title: 'How can we help you?',
      faqs: [
        { q: 'How do I place an order?', a: 'Browse our shop, add your favorite flavors to the cart, and proceed to checkout. We currently offer Cash on Delivery for all orders.' },
        { q: 'Can I customize my ice cream?', a: 'Yes! Use our "Scoop Builder" on the shop page to choose your flavors, sizes, and toppings.' },
        { q: 'Is there a minimum order amount?', a: 'There is no minimum order, but orders over ₹500 qualify for FREE delivery.' },
        { q: 'How do I track my order?', a: 'Once logged in, go to "Orders" in the navigation menu to see the real-time status of your sweet treats.' },
      ]
    },
    'delivery-info': {
      title: 'Delivery Information',
      details: [
        { title: 'Delivery Areas', desc: 'We currently deliver across Mumbai, with special focus on Marine Drive and surrounding areas.' },
        { title: 'Delivery Time',  desc: 'Most orders are delivered within 45-60 minutes. Peak hours might take slightly longer.' },
        { title: 'Packaging',      desc: 'We use premium insulated packaging and dry ice to ensure your ice cream arrives perfectly frozen.' },
        { title: 'Delivery Fee',   desc: 'A flat fee of ₹40 applies to orders below ₹500. Above ₹500, delivery is on us!' },
      ]
    },
    'terms': {
      title: 'Terms of Service',
      sections: [
        { h: 'Agreement', p: 'By using Sweet Movement, you agree to comply with our terms and conditions. These terms govern your use of our platform and services.' },
        { h: 'User Accounts', p: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.' },
        { h: 'Pricing', p: 'Prices for our products are subject to change without notice. We reserve the right to modify or discontinue services at any time.' },
      ]
    },
    'privacy': {
      title: 'Privacy Policy',
      sections: [
        { h: 'Data Collection', p: 'We collect information you provide directly to us, such as when you create an account, place an order, or contact support.' },
        { h: 'Use of Data', p: 'We use your information to process orders, improve our products, and communicate with you about your account and promotions.' },
        { h: 'Security', p: 'We implement industry-standard security measures to protect your personal data from unauthorized access or disclosure.' },
      ]
    },
    'refund': {
      title: 'Refund Policy',
      sections: [
        { h: 'Quality Guarantee', p: 'If your ice cream arrives melted or damaged, please contact us immediately for a replacement or refund.' },
        { h: 'Cancellations', p: 'Orders can be cancelled within 5 minutes of placement. After this window, the preparation process begins.' },
        { h: 'Refund Process', p: 'Approved refunds are processed within 3-5 business days and will be credited to your original payment method or wallet.' },
      ]
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-orange-50/50 to-transparent pointer-events-none" />
      <div className="absolute top-40 -left-20 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-40 -right-20 w-96 h-96 bg-orange-200/10 blur-[120px] rounded-full pointer-events-none" />

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-orange-100/50 border border-orange-200 rounded-full mb-6"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Sweet Support</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-dark tracking-tighter mb-6 font-serif italic"
          >
            Customer <span className="text-primary not-italic font-sans">Support</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed font-medium"
          >
            Everything you need to know about our luxury services, artisanal processes, and delivery excellence.
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Tabs */}
          <aside className="lg:w-80 shrink-0">
            <div className="bg-white/60 backdrop-blur-xl rounded-[3rem] p-5 shadow-soft border border-white sticky top-32">
              <nav className="space-y-3">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-[2rem] font-black transition-all duration-500 relative group ${
                      activeTab === tab.id 
                      ? 'text-white' 
                      : 'text-gray-400 hover:text-dark'
                    }`}
                  >
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="active-tab-bg"
                        className="absolute inset-0 bg-gradient-to-r from-orange-500 to-primary rounded-[2rem] shadow-glow"
                      />
                    )}
                    
                    <span className={`w-9 h-9 rounded-2xl flex items-center justify-center text-base relative z-10 transition-colors ${
                      activeTab === tab.id ? 'bg-white/20' : 'bg-gray-50 text-gray-400 group-hover:bg-orange-50'
                    }`}>
                      {tab.icon}
                    </span>
                    
                    <span className="relative z-10 text-sm tracking-tight">{tab.label}</span>
                    
                    {activeTab === tab.id && (
                      <motion.div layoutId="tab-arrow" className="ml-auto relative z-10">
                        <FiChevronRight />
                      </motion.div>
                    )}
                  </button>
                ))}
              </nav>

              <div className="mt-10 p-8 bg-dark rounded-[2.5rem] text-white relative overflow-hidden group shadow-hard">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 group-hover:bg-primary/30 transition-colors" />
                <div className="relative z-10">
                  <h4 className="font-black text-lg mb-2 italic font-serif">Still have questions?</h4>
                  <p className="text-[11px] text-gray-400 mb-6 leading-relaxed font-medium">Our artisanal support team is here to assist you with every detail.</p>
                  <a href="mailto:support@sweetmovement.com" className="flex items-center justify-center gap-2 w-full py-4 bg-white text-dark rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95">
                    Email Assistance
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="bg-white/80 backdrop-blur-xl rounded-[4rem] p-10 md:p-16 shadow-soft border border-white min-h-[650px] relative overflow-hidden"
              >
                {/* Content Header */}
                <div className="mb-12">
                  <h2 className="text-4xl md:text-5xl font-black text-dark tracking-tighter mb-4">
                    {content[activeTab].title}
                  </h2>
                  <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-orange-200 rounded-full" />
                </div>

                {activeTab === 'help-center' && (
                  <div className="grid grid-cols-1 gap-6">
                    {content[activeTab].faqs.map((faq, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 hover:bg-white hover:shadow-medium hover:border-primary/20 transition-all duration-500 group"
                      >
                        <h4 className="font-black text-dark text-lg mb-4 flex items-center gap-4 group-hover:text-primary transition-colors">
                          <span className="w-3 h-3 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                          {faq.q}
                        </h4>
                        <p className="text-gray-500 leading-relaxed font-medium pl-7">{faq.a}</p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === 'delivery-info' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {content[activeTab].details.map((detail, i) => (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="p-10 bg-orange-50/30 rounded-[3rem] border border-orange-100/50 hover:bg-white hover:shadow-medium transition-all duration-500"
                      >
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-soft mb-8">
                          <FiTruck size={28} />
                        </div>
                        <h4 className="font-black text-xl text-dark mb-3 tracking-tight">{detail.title}</h4>
                        <p className="text-gray-500 leading-relaxed font-medium">{detail.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {['terms', 'privacy', 'refund'].includes(activeTab) && (
                  <div className="space-y-12">
                    {content[activeTab].sections.map((section, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="relative pl-12"
                      >
                        <div className="absolute left-0 top-0 text-5xl font-black text-primary/5 select-none leading-none">
                          0{i + 1}
                        </div>
                        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 via-primary/5 to-transparent rounded-full" />
                        
                        <h4 className="text-xl font-black text-dark mb-4 uppercase tracking-wider italic font-serif">
                          {section.h}
                        </h4>
                        <p className="text-gray-500 text-lg leading-relaxed font-medium max-w-3xl">
                          {section.p}
                        </p>
                      </motion.div>
                    ))}
                    <div className="pt-12 border-t border-gray-100 mt-16 flex items-center justify-between">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">
                        Luxury Experience Protocol — Last Updated May 2026
                      </p>
                      <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary/20" />
                        <div className="w-2 h-2 rounded-full bg-primary/40" />
                        <div className="w-2 h-2 rounded-full bg-primary/60" />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Support
