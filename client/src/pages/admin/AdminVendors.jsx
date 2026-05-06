import { useState, useEffect } from 'react'
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-sm">{vendors.length} vendors</p>
        <button onClick={fetchVendors} className="text-primary text-sm hover:underline">Refresh</button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-16 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vendors.map(vendor => (
            <div key={vendor._id} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">
                    🏪
                  </div>
                  <div>
                    <h3 className="font-bold text-dark">{vendor.storeName}</h3>
                    <p className="text-xs text-gray-500">{vendor.user?.email}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${vendor.isApproved ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {vendor.isApproved ? 'Approved' : 'Pending'}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${vendor.isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                    {vendor.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <p>📞 {vendor.phone}</p>
                <p>📍 {vendor.address?.city}, {vendor.address?.state}</p>
                <p>🍦 {vendor.products?.length || 0} products</p>
                <p>📦 {vendor.totalOrders} orders</p>
              </div>

              <div className="flex gap-2">
                {!vendor.isApproved ? (
                  <button
                    onClick={() => approveVendor(vendor._id)}
                    className="flex-1 bg-green-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-green-600 transition-all"
                  >
                    Approve
                  </button>
                ) : (
                  <button
                    onClick={() => rejectVendor(vendor._id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-red-600 transition-all"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          ))}
          {vendors.length === 0 && (
            <div className="col-span-2 text-center py-12 text-gray-400">
              <p className="text-4xl mb-2">🤝</p>
              <p>No vendors found</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminVendors