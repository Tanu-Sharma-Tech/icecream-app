import { motion } from 'framer-motion'

const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="text-5xl"
      >
        🍦
      </motion.div>
      <p className="text-gray-500 font-medium">{text}</p>
    </div>
  )
}

export default LoadingSpinner