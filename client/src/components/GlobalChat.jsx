import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMessageCircle, FiX } from 'react-icons/fi'
import { useSelector } from 'react-redux'

const GlobalChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useSelector(state => state.auth)
  const role = user?.role || 'user'

  const [messages, setMessages] = useState([
    { type: 'bot', text: `Hello! I'm your Sweet Assistant. How can I help you today as a ${role}?` }
  ])
  
  const chatbotData = {
    user: [
      { q: "Where is my order?", a: "You can track your order in real-time in the 'Orders' section of your account profile." },
      { q: "Scoop Builder help?", a: "Head over to the Shop and click 'Build Your Own Scoop' to create your custom masterpiece!" },
      { q: "Delivery hours?", a: "We deliver artisanal scoops from 10:00 AM to 11:30 PM daily across Mumbai." },
      { q: "Refund policy?", a: "We offer immediate replacements or refunds if your ice cream arrives melted or damaged." }
    ],
    vendor: [
      { q: "Listing products?", a: "Navigate to your Vendor Dashboard > Inventory and click 'Add New Product' to get started." },
      { q: "Payout schedule?", a: "Vendor payouts are automatically processed every Monday for all completed orders from the previous week." },
      { q: "Store settings?", a: "You can update your shop's description and operating hours in the 'Store Profile' section of your dashboard." }
    ],
    admin: [
      { q: "Vendor approval?", a: "Check 'Pending Applications' in your Admin Panel to review and approve new shop partners." },
      { q: "Revenue reports?", a: "Comprehensive financial analytics are available under the 'Financials' tab on your main dashboard." },
      { q: "System alerts?", a: "Use the 'Global Broadcast' tool to send notifications to all users or specific roles." }
    ]
  }

  const handleSelectQuestion = (item) => {
    setMessages(prev => [
      ...prev, 
      { type: 'user', text: item.q },
      { type: 'bot', text: item.a }
    ])
  }

  return (
    <div className="fixed bottom-6 right-6 z-[999]">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-glow border-2 border-white/20 relative"
        >
          <FiMessageCircle size={24} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8, originX: 1, originY: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="absolute bottom-0 right-0 w-80 sm:w-96 bg-white rounded-[2.5rem] shadow-hard overflow-hidden border border-gray-100 flex flex-col"
          >
            {/* Header */}
            <div className="bg-primary p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FiMessageCircle size={20} />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-widest leading-none mb-1">Sweet Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <p className="text-[9px] opacity-80 font-bold capitalize">{role} Assistant Online</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="h-[350px] overflow-y-auto p-5 space-y-4 bg-gray-50/30">
              {messages.map((m, i) => (
                <motion.div
                  initial={{ opacity: 0, x: m.type === 'bot' ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className={`flex ${m.type === 'bot' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed ${
                    m.type === 'bot' 
                    ? 'bg-white text-dark shadow-sm rounded-tl-none border border-gray-50' 
                    : 'bg-primary text-white shadow-glow rounded-tr-none'
                  }`}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Questions area */}
            <div className="p-4 bg-white border-t border-gray-50">
              <p className="text-[9px] font-black uppercase text-gray-400 mb-3 px-2 tracking-widest">How can I help you?</p>
              <div className="flex flex-wrap gap-2">
                {chatbotData[role]?.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectQuestion(item)}
                    className="px-3 py-2 bg-gray-50 hover:bg-orange-50 hover:text-primary border border-gray-100 rounded-xl text-[11px] font-bold transition-all text-left"
                  >
                    {item.q}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default GlobalChat
