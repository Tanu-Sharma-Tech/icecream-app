import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiPhone, FiSave, FiArrowLeft, FiCamera, FiMapPin, FiAlertTriangle, FiX } from 'react-icons/fi'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axiosInstance from '../api/axiosInstance'
import { getMe } from '../features/auth/authSlice'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const ProfileSettings = () => {
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const [form, setForm] = useState({
    name:  user?.name  || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city:   user?.address?.city   || '',
    state:  user?.address?.state  || '',
    pincode:user?.address?.pincode|| '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [preview,   setPreview]   = useState(user?.profileImage || '')
  const [loading,   setLoading]   = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  const handleCancelApplication = async () => {
    try {
      setLoading(true)
      const res = await axiosInstance.post('/vendors/cancel')
      toast.success(res.data.message)
      dispatch(getMe())
      setShowCancelModal(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cancellation failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      setForm({
        name:  user.name  || '',
        email: user.email || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city:   user.address?.city   || '',
        state:  user.address?.state  || '',
        pincode:user.address?.pincode|| '',
      })
      setPreview(user.profileImage || '')
    }
  }, [user])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return toast.error('Image size must be less than 5MB')
      }
      setImageFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (form.name.trim().length < 2) {
      return toast.error('Name must be at least 2 characters')
    }
    if (form.phone && !/^\d{10}$/.test(form.phone)) {
      return toast.error('Please enter a valid 10-digit phone number')
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('phone', form.phone)
      formData.append('street', form.street)
      formData.append('city', form.city)
      formData.append('state', form.state)
      formData.append('pincode', form.pincode)
      if (imageFile) {
        formData.append('image', imageFile)
      }

      await axiosInstance.put('/auth/update-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      toast.success('Profile updated successfully!')
      dispatch(getMe())
      
      // Navigate to home after a short delay
      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 md:px-8 pt-28 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 bg-white rounded-xl shadow-soft hover:text-primary transition-all active:scale-90"
            >
              <FiArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-black text-dark tracking-tight">Account Settings</h1>
          </div>

          <div className="bg-white rounded-[2rem] shadow-soft border border-gray-50 overflow-hidden">
            {/* Cover/Avatar Header */}
            <div className="h-32 bg-gradient-to-r from-primary to-orange-600 relative">
              <div className="absolute -bottom-12 left-8">
                <div className="relative group">
                  <div className="w-24 h-24 bg-white rounded-3xl p-1 shadow-medium overflow-hidden">
                    {preview ? (
                      <img 
                        src={preview} 
                        alt="Profile" 
                        className="w-full h-full object-cover rounded-2xl border border-orange-100"
                      />
                    ) : (
                      <div className="w-full h-full bg-orange-50 rounded-2xl flex items-center justify-center text-3xl font-black text-primary border border-orange-100">
                        {user?.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-2 bg-dark text-white rounded-xl shadow-hard scale-0 group-hover:scale-100 transition-transform cursor-pointer hover:bg-black">
                    <FiCamera size={14} />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-16 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="Your Name"
                        required
                      />
                    </div>
                  </div>

                  {/* Email (Read Only) */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input
                        type="email"
                        value={form.email}
                        readOnly
                        className="w-full bg-gray-100 border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-gray-400 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
                    <div className="relative">
                      <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="9876543210"
                      />
                    </div>
                  </div>

                  {/* Street Address */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Street Address</label>
                    <div className="relative">
                      <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input
                        type="text"
                        value={form.street}
                        onChange={e => setForm({ ...form, street: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="House no, street, area"
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">City</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={e => setForm({ ...form, city: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-4 text-sm font-bold text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="City"
                    />
                  </div>

                  {/* State */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">State</label>
                    <input
                      type="text"
                      value={form.state}
                      onChange={e => setForm({ ...form, state: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-4 text-sm font-bold text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="State"
                    />
                  </div>

                  {/* Pincode */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Pincode</label>
                    <input
                      type="text"
                      value={form.pincode}
                      onChange={e => setForm({ ...form, pincode: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-4 text-sm font-bold text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="6-digit pincode"
                    />
                  </div>

                  {/* Role (Badge) */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Account Role</label>
                    <div className="py-3.5 px-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-widest text-dark">{user?.role}</span>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-glow shadow-emerald-500/50" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-gray-50 mt-8">
                  <p className="text-[10px] text-gray-400 font-bold max-w-[200px]">
                    Updates to your account information take effect immediately across all platforms.
                  </p>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3.5 bg-dark text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black shadow-hard transition-all active:scale-95 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <FiSave />
                    )}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Security Warning */}
          <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
              ⚠️
            </div>
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-widest text-amber-900">Security Note</h4>
              <p className="text-[10px] text-amber-800 font-medium mt-0.5">
                Email addresses are linked to your login credentials and cannot be changed here. Contact support if you need to migrate your account.
              </p>
            </div>
          </div>

          {/* Vendor Application Section */}
          {user?.role === 'user' && (
            <div className="mt-6 bg-white rounded-[2rem] shadow-soft border border-gray-50 overflow-hidden p-8">
              <h3 className="text-lg font-black text-dark mb-2">Vendor Application</h3>
              
              {(!user.vendorStatus || user.vendorStatus === 'none') && (
                <div>
                  <p className="text-sm text-gray-500 mb-4">
                    Interested in selling your ice cream on our platform? Apply to become a vendor today!
                  </p>
                  <button
                    onClick={async () => {
                      try {
                        setLoading(true)
                        const res = await axiosInstance.post('/vendors/apply')
                        toast.success(res.data.message)
                        dispatch(getMe())
                      } catch (error) {
                        toast.error(error.response?.data?.message || 'Application failed')
                      } finally {
                        setLoading(false)
                      }
                    }}
                    disabled={loading}
                    className="px-6 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-hard disabled:opacity-50"
                  >
                    Apply Now
                  </button>
                </div>
              )}

              {user.vendorStatus === 'pending' && (
                <div className="p-4 bg-blue-50 text-blue-800 rounded-2xl border border-blue-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold mb-1">Application Pending</h4>
                    <p className="text-sm">We've received your vendor application! Our team is reviewing it. You will receive an email once approved.</p>
                  </div>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    disabled={loading}
                    className="px-4 py-2 bg-white text-red-600 border border-red-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-50 hover:border-red-300 transition-all shadow-sm disabled:opacity-50 whitespace-nowrap"
                  >
                    Cancel Application
                  </button>
                </div>
              )}

              {user.vendorStatus === 'approved' && (
                <div>
                  <p className="text-sm text-gray-500 mb-4 font-bold text-emerald-600">
                    Congratulations! Your application is approved. Please enter the verification code sent to your email.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="text"
                      id="vendorCodeInput"
                      placeholder="Enter 6-digit code"
                      className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-full max-w-[200px]"
                    />
                    <button
                      onClick={async () => {
                        const code = document.getElementById('vendorCodeInput').value
                        if (!code) return toast.error('Please enter the code')
                        try {
                          setLoading(true)
                          const res = await axiosInstance.post('/vendors/verify-code', { code })
                          toast.success(res.data.message)
                          dispatch(getMe())
                        } catch (error) {
                          toast.error(error.response?.data?.message || 'Verification failed')
                        } finally {
                          setLoading(false)
                        }
                      }}
                      disabled={loading}
                      className="px-6 py-3 bg-dark text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-hard disabled:opacity-50"
                    >
                      Verify Code
                    </button>
                    <button
                      onClick={() => setShowCancelModal(true)}
                      disabled={loading}
                      className="px-6 py-3 bg-white text-red-600 border border-red-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-50 hover:border-red-300 transition-all shadow-sm disabled:opacity-50"
                    >
                      Cancel Application
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>
      <Footer />

      {/* Custom Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2rem] p-8 max-w-sm w-full relative shadow-2xl text-center"
          >
            <button 
              onClick={() => setShowCancelModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX size={24} />
            </button>
            
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiAlertTriangle className="text-[#ef4444]" size={36} />
            </div>

            <h3 className="text-2xl font-black text-dark mb-3 italic">Cancel Application?</h3>
            <p className="text-gray-500 text-sm font-medium mb-8">
              Are you sure you want to cancel your vendor application? This action cannot be undone.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleCancelApplication}
                disabled={loading}
                className="w-full py-4 bg-[#ef4444] text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-[#dc2626] transition-all shadow-lg shadow-red-500/30 disabled:opacity-50"
              >
                {loading ? 'Canceling...' : 'Yes, Cancel Application'}
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={loading}
                className="w-full py-4 bg-gray-50 text-gray-600 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-gray-100 transition-all disabled:opacity-50"
              >
                No, Keep It
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default ProfileSettings
