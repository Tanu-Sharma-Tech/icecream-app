import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const SplashLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Progress increment logic
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100
        const jump = Math.random() * 15
        return Math.min(prev + jump, 100)
      })
    }, 350)

    // Ensure it closes after a maximum of 5 seconds
    const timer = setTimeout(() => {
      onComplete()
    }, 5000)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-[9999] bg-[#2D2B2E] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Decorative Element */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-orange-500/10 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        
        {/* Animated Icon */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative mb-12"
        >
          <div className="text-8xl filter drop-shadow-[0_0_30px_rgba(249,115,22,0.5)] select-none">
            🍦
          </div>
          <motion.div 
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-orange-500/20 rounded-full blur-3xl"
          />
        </motion.div>

        {/* Brand Name */}
        <div className="mb-4">
          <motion.h1
            initial={{ letterSpacing: "1em", opacity: 0 }}
            animate={{ letterSpacing: "0.25em", opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-black text-white italic leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Sweet <span className="text-primary not-italic font-normal">Movement</span>
          </motion.h1>
        </div>

        {/* Est. 2026 Reveal */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
          className="flex items-center gap-6 mb-20 overflow-hidden max-w-xs mx-auto"
        >
          <div className="h-[0.5px] flex-1 bg-gradient-to-r from-transparent to-primary/60" />
          <span className="text-[11px] font-bold uppercase tracking-[0.6em] text-primary whitespace-nowrap">
            Est. 2026
          </span>
          <div className="h-[0.5px] flex-1 bg-gradient-to-l from-transparent to-primary/60" />
        </motion.div>

        {/* Modern Counter */}
        <div className="flex flex-col items-center gap-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-baseline"
          >
            <span className="text-6xl font-light text-white/90 tabular-nums tracking-tighter">
              {Math.floor(progress)}
            </span>
            <span className="text-sm font-bold text-primary uppercase ml-2 tracking-widest">
              %
            </span>
          </motion.div>

          {/* Luxury Progress Line */}
          <div className="w-64 h-[1px] bg-white/5 relative overflow-hidden rounded-full">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: progress / 100 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary to-primary/20 origin-left"
            />
          </div>
        </div>
      </div>

      {/* Luxury Framing */}
      <div className="fixed inset-12 pointer-events-none">
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/10 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/10 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/10 rounded-br-2xl" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,900;1,400;1,900&display=swap');
      `}} />
    </motion.div>
  )
}

export default SplashLoader
