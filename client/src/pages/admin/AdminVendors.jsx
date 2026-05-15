import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiTruck, FiRefreshCw, FiPhone, FiMapPin, FiPackage, FiShoppingBag, FiCheck, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import axiosInstance from '../../api/axiosInstance'

const AdminVendors = () => {
  const [vendors,  setVendors]  = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => { fetchVendors() }, [])

  const fetchVendors = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get('/admin/vendors')
      setVendors(res.data.vendors)
    } catch {
      toast.error('Failed to load vendors')
    } finally {
      setLoading(false)
    }
  }

  const approveVendor = async (id) => {
    try {
      await axiosInstance.put(`/admin/vendors/${id}/approve`)
      toast.success('Vendor approved!')
      fetchVendors()
    } catch {
      toast.error('Failed to approve vendor')
    }
  }

  const rejectVendor = async (id) => {
    try {
      await axiosInstance.put(`/admin/vendors/${id}/reject`)
      toast.success('Vendor rejected')
      fetchVendors()
    } catch {
      toast.error('Failed to reject vendor')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="bg-white px-4 py-2 rounded-xl shadow-soft border border-gray-50 flex items-center gap-2">
          <FiTruck className="text-primary" />
          <p className="text-sm font-bold text-dark">{vendors.length} <span className="text-gray-400 font-medium">Partner Vendors</span></p>
        </div>
        <button 
          onClick={fetchVendors} 
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-500 hover:text-primary rounded-xl shadow-soft border border-gray-50 transition-all active:scale-95 text-sm font-bold"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-3xl h-48 animate-pulse border border-gray-50 shadow-soft" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={vendor._id} 
              className="bg-white rounded-3xl p-6 shadow-soft border border-gray-50 hover:shadow-medium transition-all group relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-orange-100 group-hover:scale-110 transition-transform">
                    🏪
                  </div>
                  <div>
                    <h3 className="font-black text-dark text-lg leading-tight tracking-tight">{vendor.storeName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{vendor.user?.email}</p>
                      {vendor.isMissingProfile && (
                        <span className="bg-amber-100 text-amber-600 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md border border-amber-200">Incomplete</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
                <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 bg-gray-50 p-2 rounded-xl border border-gray-100">
                  <FiPhone className="text-primary" />
                  {vendor.phone}
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 bg-gray-50 p-2 rounded-xl border border-gray-100">
                  <FiMapPin className="text-primary" />
                  {vendor.address?.city}
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 bg-gray-50 p-2 rounded-xl border border-gray-100">
                  <FiPackage className="text-primary" />
                  {vendor.products?.length || 0} Prods
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 bg-gray-50 p-2 rounded-xl border border-gray-100">
                  <FiShoppingBag className="text-primary" />
                  {vendor.totalOrders} Orders
                </div>
              </div>

              <div className="flex gap-3 relative z-10">
                {!vendor.isApproved ? (
                  <button
                    onClick={() => approveVendor(vendor._id)}
                    disabled={vendor.isMissingProfile}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 shadow-glow transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiCheck />
                    {vendor.isMissingProfile ? 'Profile Required' : 'Approve'}
                  </button>
                ) : (
                  <button
                    onClick={() => rejectVendor(vendor._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-500 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95 border border-red-100"
                  >
                    <FiX />
                    Revoke Access
                  </button>
                )}
              </div>
              
              <div className="absolute -bottom-4 -right-4 text-gray-50/50 -rotate-12 pointer-events-none group-hover:rotate-0 transition-transform duration-700">
                <FiTruck size={100} />
              </div>
            </motion.div>
          ))}
          {vendors.length === 0 && (
            <div className="col-span-full text-center py-20 bg-gray-50/30 rounded-3xl border-2 border-dashed border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <FiTruck size={40} />
              </div>
              <h4 className="text-dark font-bold">No partner vendors</h4>
              <p className="text-gray-400 text-xs mt-1">New applications will appear here</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminVendors