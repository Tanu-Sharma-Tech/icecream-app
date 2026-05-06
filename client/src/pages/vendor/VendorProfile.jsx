import { useState } from 'react'
import toast from 'react-hot-toast'
import axiosInstance from '../../api/axiosInstance'

const VendorProfile = ({ vendor, onRefresh }) => {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    storeName:   vendor?.storeName   || '',
    description: vendor?.description || '',
    phone:       vendor?.phone       || '',
    email:       vendor?.email       || '',
  })
  const [bank, setBank] = useState({
    accountName:   vendor?.bankDetails?.accountName   || '',
    accountNumber: vendor?.bankDetails?.accountNumber || '',
    ifscCode:      vendor?.bankDetails?.ifscCode      || '',
    bankName:      vendor?.bankDetails?.bankName      || '',
  })

  const handleUpdateProfile = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await axiosInstance.put('/vendors/my/profile', form)
      toast.success('Profile updated!')
      onRefresh()
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateBank = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await axiosInstance.put('/vendors/my/bank-details', bank)
      toast.success('Bank details updated!')
    } catch {
      toast.error('Failed to update bank details')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">

      {/* Store Details */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-dark mb-4">Store Details</h3>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
            <input value={form.storeName} onChange={e => setForm({...form, storeName: e.target.value})}
              className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="input-field" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="bg-primary text-white px-6 py-2 rounded-xl font-medium hover:bg-orange-600 transition-all disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Bank Details */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-dark mb-1">Bank Details</h3>
        <p className="text-gray-500 text-sm mb-4">For receiving payments</p>
        <form onSubmit={handleUpdateBank} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
              <input value={bank.accountName} onChange={e => setBank({...bank, accountName: e.target.value})}
                placeholder="Your full name" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <input value={bank.bankName} onChange={e => setBank({...bank, bankName: e.target.value})}
                placeholder="HDFC Bank" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <input value={bank.accountNumber} onChange={e => setBank({...bank, accountNumber: e.target.value})}
                placeholder="1234567890" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
              <input value={bank.ifscCode} onChange={e => setBank({...bank, ifscCode: e.target.value})}
                placeholder="HDFC0001234" className="input-field" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="bg-primary text-white px-6 py-2 rounded-xl font-medium hover:bg-orange-600 transition-all disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Bank Details'}
          </button>
        </form>
      </div>

      {/* Approval Status */}
      <div className={`rounded-2xl p-5 ${vendor?.isApproved ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{vendor?.isApproved ? '✅' : '⏳'}</span>
          <div>
            <h4 className="font-bold text-dark">
              {vendor?.isApproved ? 'Store Approved' : 'Pending Approval'}
            </h4>
            <p className="text-sm text-gray-500">
              {vendor?.isApproved
                ? 'Your store is live and visible to customers!'
                : 'Admin will review and approve your store soon.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorProfile