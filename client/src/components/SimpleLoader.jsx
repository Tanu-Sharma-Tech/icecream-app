import { motion } from 'framer-motion'

const SimpleLoader = ({ text = "Loading Sweetness" }) => {
  return (
    <div className="fixed inset-0 z-[9999] bg-white/40 backdrop-blur-xl flex flex-col items-center justify-center">
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative flex flex-col items-center">
        {/* Elegant Animated Icon */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-8xl mb-8 select-none filter drop-shadow-[0_10px_20px_rgba(249,115,22,0.2)]"
        >
          🍦
        </motion.div>
        
        <div className="flex flex-col items-center">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-dark font-black tracking-[0.4em] text-[11px] uppercase mb-6"
          >
            {text}
          </motion.p>
          
          {/* Refined Luxury Progress Indicator */}
          <div className="w-40 h-[1.5px] bg-gray-200/50 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: [0.76, 0, 0.24, 1] 
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent"
            />
          </div>
        </div>
      </div>

      {/* Decorative Border */}
      <div className="absolute inset-10 border border-dark/[0.03] rounded-[40px] pointer-events-none" />
    </div>
  )
}

export default SimpleLoader
