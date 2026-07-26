import { useState } from 'react'
import { Search, ShieldCheck, User, Bell } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import NotificationBell from '../notifications/NotificationBell'

export default function AdminNavbar({ onSearch }) {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchChange = (e) => {
    const val = e.target.value
    setSearchTerm(val)
    if (onSearch) onSearch(val)
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 backdrop-blur-md px-6 shadow-xs">
      {/* Search Input */}
      <div className="relative w-full max-w-md">
        <Search size={16} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Global Admin Search (Users, Documents, Reports, Case IDs)…"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-9 pr-4 text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* System Health Badge */}
        <div className="hidden sm:flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-800">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>System Healthy • 100% UP</span>
        </div>

        {/* Notifications */}
        <NotificationBell />

        {/* Admin Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-900 text-white font-bold text-xs shadow-xs">
            {user?.name ? user.name[0].toUpperCase() : 'A'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-tight">
              {user?.name || 'Administrator'}
            </p>
            <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">
              {user?.role || 'Super Admin'}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
