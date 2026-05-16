import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiPhone, FiSave, FiArrowLeft, FiCamera, FiMapPin } from 'react-icons/fi'
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
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}

export default ProfileSettings
