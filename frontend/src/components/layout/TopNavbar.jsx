import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Menu, Moon, Sun, Scale, User, LogOut, Settings, ShieldCheck, ChevronDown, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import NotificationBell from '../notifications/NotificationBell'
import toast from 'react-hot-toast'

function UserAvatar({ user }) {
  const initials = user?.name
    ?.split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? 'U'

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-xs font-extrabold text-white shrink-0 shadow-sm shadow-indigo-500/20">
      {initials}
    </div>
  )
}

export default function TopNavbar({ onMenuToggle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dark, setDark] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/dashboard/documents?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-6 shadow-xs">
      {/* ── Left Controls: Mobile Menu & Logo ── */}
      <div className="flex items-center gap-3">
        {/* Hamburger Mobile Toggle */}
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors lg:hidden"
          aria-label="Open mobile navigation"
          id="mobile-menu-btn"
        >
          <Menu size={20} />
        </button>

        {/* Mobile Brand Logo */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <Scale size={16} />
          </div>
          <span className="text-sm font-extrabold text-slate-900">LawAssist AI</span>
        </div>

        {/* ── Search Bar (Desktop) ── */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative w-72 lg:w-96">
          <Search size={15} className="absolute left-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search documents, cases, legal clauses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-2 pl-9 pr-12 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
            id="dashboard-search"
          />
          <kbd className="absolute right-3 hidden sm:inline-flex items-center rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-mono text-slate-400 shadow-2xs">
            ⌘K
          </kbd>
        </form>
      </div>

      {/* ── Right Actions ── */}
      <div className="flex items-center gap-2">
        {/* Theme Mode Toggle */}
        <button
          onClick={() => setDark((d) => !d)}
          className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors relative"
          aria-label="Toggle light or dark theme"
          id="theme-toggle-btn"
          title="Toggle Theme"
        >
          <AnimatePresence mode="wait">
            {dark ? (
              <motion.span
                key="sun"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sun size={18} />
              </motion.span>
            ) : (
              <motion.span
                key="moon"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Moon size={18} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Smart Notifications Bell */}
        <NotificationBell />

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-slate-200 mx-1" />

        {/* User Profile Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2.5 p-1 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer"
            id="user-menu"
          >
            <UserAvatar user={user} />
            {user && (
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-none">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-500 font-medium leading-none mt-1">
                  {user.email}
                </p>
              </div>
            )}
            <ChevronDown size={14} className="text-slate-400 hidden lg:block" />
          </button>

          {/* User Dropdown Panel */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-13 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
              >
                {/* Header User Summary */}
                <div className="p-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                  <span className="inline-flex items-center gap-1 mt-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[9px] font-extrabold uppercase">
                    <ShieldCheck size={10} /> Verified Citizen
                  </span>
                </div>

                {/* Dropdown Items */}
                <div className="space-y-0.5 text-xs font-semibold text-slate-700">
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      navigate('/dashboard/profile')
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <User size={15} className="text-slate-500" /> Account Profile
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      navigate('/dashboard/settings')
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <Settings size={15} className="text-slate-500" /> Preferences & Settings
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut size={15} /> Logout Account
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
