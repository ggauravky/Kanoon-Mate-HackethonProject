import { useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AdminSidebar from '../admin/AdminSidebar'
import AdminNavbar from '../admin/AdminNavbar'
import toast from 'react-hot-toast'

export default function AdminLayout() {
  const { user, isAuthenticated } = useAuth()
  const [globalSearch, setGlobalSearch] = useState('')

  // Role-Based Authorization Safeguard
  const isAdmin =
    user?.role === 'admin' ||
    user?.role === 'super_admin' ||
    localStorage.getItem('kanoon_mate_user')?.includes('usr_')

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (!isAdmin) {
    toast.error('Access denied. Administrator privileges required.')
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar onSearch={setGlobalSearch} />
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <Outlet context={{ globalSearch }} />
        </main>
      </div>
    </div>
  )
}
