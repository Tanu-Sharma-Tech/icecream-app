import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiTrash2, FiUser, FiMail, FiCalendar, FiShield, FiCheckCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'
import axiosInstance from '../../api/axiosInstance'

const roleColors = {
  user:   'bg-blue-50 text-blue-600 border-blue-100',
  admin:  'bg-red-50 text-red-600 border-red-100',
  vendor: 'bg-green-50 text-green-600 border-green-100',
}

const AdminUsers = () => {
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get('/admin/users')
      setUsers(res.data.users)
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const updateRole = async (userId, role) => {
    try {
      await axiosInstance.put(`/admin/users/${userId}/role`, { role })
      toast.success('Role updated!')
      fetchUsers()
    } catch {
      toast.error('Failed to update role')
    }
  }

  const deleteUser = async (userId) => {
    if (!window.confirm('Delete this user?')) return
    try {
      await axiosInstance.delete(`/admin/users/${userId}`)
      toast.success('User deleted')
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete')
    }
  }

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = d => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full bg-white border border-gray-100 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-soft"
          />
        </div>
        <p className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-xl shadow-soft border border-gray-50">
          Total: <span className="text-dark font-bold">{users.length}</span> Users
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-3xl h-20 animate-pulse border border-gray-50 shadow-soft" />)}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-soft border border-gray-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-gray-400 font-bold uppercase tracking-wider text-[10px]">User</th>
                  <th className="px-6 py-4 text-gray-400 font-bold uppercase tracking-wider text-[10px]">Email</th>
                  <th className="px-6 py-4 text-gray-400 font-bold uppercase tracking-wider text-[10px]">Role</th>
                  <th className="px-6 py-4 text-gray-400 font-bold uppercase tracking-wider text-[10px]">Status</th>
                  <th className="px-6 py-4 text-gray-400 font-bold uppercase tracking-wider text-[10px]">Joined</th>
                  <th className="px-6 py-4 text-gray-400 font-bold uppercase tracking-wider text-[10px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((user, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={user._id} 
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center font-bold text-primary shadow-sm border border-primary/20">
                          {user.name?.[0]?.toUpperCase() || <FiUser />}
                        </div>
                        <span className="font-bold text-dark">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-500 font-medium">
                        <FiMail className="opacity-50" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={e => updateRole(user._id, e.target.value)}
                        className={`text-[10px] px-3 py-1.5 rounded-lg font-black uppercase tracking-widest border ${roleColors[user.role]} focus:outline-none cursor-pointer transition-all hover:shadow-sm`}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="vendor">Vendor</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${user.isVerified ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                        {user.isVerified ? <FiCheckCircle /> : <FiShield />}
                        {user.isVerified ? 'Verified' : 'Pending'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-medium">
                      <div className="flex items-center gap-2 text-[11px]">
                        <FiCalendar className="opacity-50" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-90"
                        title="Delete User"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-20 bg-gray-50/30">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <FiUsers size={40} />
              </div>
              <h4 className="text-dark font-bold">No users found</h4>
              <p className="text-gray-400 text-xs mt-1">Try searching for something else</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminUsers