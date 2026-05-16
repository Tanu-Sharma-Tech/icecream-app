import { motion, AnimatePresence } from 'framer-motion'
import { FiAlertTriangle, FiX } from 'react-icons/fi'

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger' }) => {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          <div className="p-8 text-center">
            {/* Icon */}
            <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl shadow-soft ${
              type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-primary'
            }`}>
              <FiAlertTriangle />
            </div>

            <h3 className="text-2xl font-black text-dark mb-2 tracking-tight italic font-serif">{title}</h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8">
              {message}
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => { onConfirm(); onClose(); }}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-hard hover:shadow-glow ${
                  type === 'danger' 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-primary text-white hover:bg-orange-600'
                }`}
              >
                {confirmText}
              </button>
              <button
                onClick={onClose}
                className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all active:scale-95"
              >
                {cancelText}
              </button>
            </div>
          </div>

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-dark transition-colors"
          >
            <FiX size={20} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ConfirmationModal
