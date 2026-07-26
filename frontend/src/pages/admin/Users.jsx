import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Trash2, CheckCircle2, XCircle } from 'lucide-react'
import { adminAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedRole, setSelectedRole] = useState('All')

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await adminAPI.getUsers({ search, role: selectedRole === 'All' ? undefined : selectedRole })
      const list = res.data?.data?.users || []
      setUsers(list)
    } catch (err) {
      toast.error('Failed to load user accounts from server.')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [selectedRole])

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminAPI.updateUser(userId, { role: newRole })
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)))
      toast.success(`Role updated to ${newRole}`)
    } catch (err) {
      toast.error(err.message || 'Failed to update user role.')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user account?')) return

    try {
      await adminAPI.deleteUser(userId)
      setUsers((prev) => prev.filter((u) => u._id !== userId))
      toast.success('User account deleted successfully.')
    } catch (err) {
      toast.error(err.message || 'Failed to delete user account.')
    }
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch = (u.name || '').toLowerCase().includes(search.toLowerCase()) || (u.email || '').toLowerCase().includes(search.toLowerCase())
    const matchesRole = selectedRole === 'All' || u.role === selectedRole
    return matchesSearch && matchesRole
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-7xl mx-auto pb-12"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">User Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage registered user roles, verification statuses, and account access permissions.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search user by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-800 focus:bg-white focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['All', 'citizen', 'admin', 'super_admin'].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                selectedRole === role
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* User Table */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 font-medium">
            No registered users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase font-semibold">
                  <th className="p-3">User</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Verification</th>
                  <th className="p-3">Joined Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs">
                          {u.name ? u.name[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{u.name}</p>
                          <p className="text-[11px] text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-800 focus:bg-white outline-none cursor-pointer"
                      >
                        <option value="citizen">Citizen</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {u.isVerified ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {u.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-3 font-mono">
                      {new Date(u.createdAt || Date.now()).toLocaleDateString('en-IN')}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete User"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  )
}
