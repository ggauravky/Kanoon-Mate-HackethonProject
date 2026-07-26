import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Menu,
  Bell,
  Search,
  ShieldCheck,
  Power,
  Sun,
  Moon,
  ChevronDown,
  UserCheck,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function AdvocateNavbar({ onMobileMenuToggle }) {
  const { user, logout } = useAuth()
  const [isDark, setIsDark] = useState(true)
  const navigate = useNavigate()

  const toggleTheme = () => setIsDark((prev) => !prev)

  const [online, setOnline] = useState(true)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleToggleOnline = () => {
    setOnline((prev) => !prev)
    toast.success(!online ? 'Status set to Available Online' : 'Status set to Offline / Away')
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/advocate/client-requests?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const advocateName = user?.name?.startsWith('Adv.') ? user.name : `Adv. ${user?.name || 'Professional'}`

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 sm:px-6 backdrop-blur-md text-white shadow-xs">
      {/* Left: Mobile Toggle & Brand/Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          aria-label="Open Mobile Menu"
        >
          <Menu size={18} />
        </button>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative w-64 lg:w-80">
          <Search size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clients, requests, practice areas..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-9 pr-4 py-1.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </form>
      </div>

      {/* Right: Actions, Status & User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Online Status Toggle Badge */}
        <button
          onClick={handleToggleOnline}
          className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
            online
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
          }`}
          title="Click to toggle availability"
        >
          <span className={`h-2 w-2 rounded-full ${online ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span className="hidden sm:inline">{online ? 'Available Online' : 'Away / Offline'}</span>
        </button>

        {/* Bar Verification Badge */}
        <div className="hidden xl:flex items-center gap-1.5 rounded-xl bg-indigo-500/10 px-3 py-1.5 text-xs font-bold text-indigo-300 border border-indigo-500/30">
          <ShieldCheck size={14} className="text-indigo-400" />
          <span>Bar Verified</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          title="Toggle theme"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notification Bell */}
        <Link
          to="/advocate/notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          title="Notifications"
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-slate-950" />
        </Link>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <span className="hidden md:inline text-xs font-bold text-white max-w-[120px] truncate">
              {advocateName}
            </span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 p-2 shadow-xl z-50 text-xs">
              <div className="p-2 border-b border-slate-800 mb-1">
                <p className="font-bold text-white truncate">{advocateName}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>

              <Link
                to="/advocate/profile"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <UserCheck size={14} /> My Profile & Specialization
              </Link>
              <Link
                to="/advocate/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Settings size={14} /> Account Settings
              </Link>

              <div className="my-1 border-t border-slate-800" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-left font-medium"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
