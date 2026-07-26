import { useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  UserCheck,
  Inbox,
  Sparkles,
  Gavel,
  Clock,
  Star,
  BarChart3,
  FileCheck2,
  Bell,
  Settings,
  LogOut,
  Scale,
  ChevronLeft,
  ChevronRight,
  X,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

// ─── Advocate Specific Navigation Configuration ─────────────────────────────────
const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/advocate', end: true },
  { id: 'profile', label: 'My Profile', icon: UserCheck, to: '/advocate/profile' },
  { id: 'client-requests', label: 'Client Requests', icon: Inbox, to: '/advocate/client-requests' },
  { id: 'matched-clients', label: 'AI Matched Clients', icon: Sparkles, to: '/advocate/matched-clients' },
  { id: 'practice-areas', label: 'Practice Areas', icon: Gavel, to: '/advocate/practice-areas' },
  { id: 'availability', label: 'Availability & Schedule', icon: Clock, to: '/advocate/availability' },
  { id: 'reviews', label: 'Reviews & Ratings', icon: Star, to: '/advocate/reviews' },
  { id: 'analytics', label: 'Performance Analytics', icon: BarChart3, to: '/advocate/analytics' },
  { id: 'documents', label: 'Document Library', icon: FileCheck2, to: '/advocate/documents' },
  { id: 'notifications', label: 'Notifications', icon: Bell, to: '/advocate/notifications' },
]

const bottomItems = [
  { id: 'settings', label: 'Settings', icon: Settings, to: '/advocate/settings' },
]

// ─── User Avatar Component ─────────────────────────────────────────────────────
function UserAvatar({ user, size = 'md' }) {
  const initials = user?.name
    ?.split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? 'ADV'

  const sizeClass = size === 'sm' ? 'h-8 w-8 text-xs' : 'h-9 w-9 text-xs font-extrabold'

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-800 text-white ring-2 ring-indigo-400/30 shadow-md ${sizeClass}`}
    >
      {initials}
    </div>
  )
}

// ─── Sidebar Link Item ────────────────────────────────────────────────────────
function SidebarLink({ item, collapsed }) {
  const location = useLocation()
  const isActive = item.end
    ? location.pathname === item.to
    : location.pathname.startsWith(item.to)

  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
        isActive
          ? 'text-white font-bold'
          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
      } ${collapsed ? 'justify-center px-0' : ''}`}
      title={collapsed ? item.label : undefined}
    >
      {/* Active Pill Animation */}
      {isActive && (
        <motion.div
          layoutId="advocateSidebarActivePill"
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 shadow-md shadow-indigo-600/30 border border-indigo-400/30"
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />
      )}

      {/* Icon */}
      <span className="relative z-10 flex items-center justify-center shrink-0">
        <item.icon
          size={18}
          className={`transition-transform duration-200 ${
            isActive ? 'text-white scale-105' : 'text-slate-400 group-hover:text-slate-100 group-hover:scale-105'
          }`}
        />
      </span>

      {/* Label */}
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 overflow-hidden whitespace-nowrap"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  )
}

// ─── Sidebar Inner Content ───────────────────────────────────────────────────
function AdvocateSidebarContent({ collapsed, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Advocate session ended')
    navigate('/')
  }

  return (
    <div className="flex h-full flex-col bg-slate-950 text-white select-none">
      {/* Brand Header */}
      <div
        className={`flex items-center gap-3 px-4 py-5 border-b border-slate-800/80 ${
          collapsed ? 'justify-center px-2' : ''
        }`}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-slate-800 text-white shadow-md border border-indigo-400/30">
          <Scale size={18} />
        </div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden min-w-0"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-white font-extrabold text-sm tracking-tight whitespace-nowrap">
                  LawAssist AI
                </span>
                <span className="rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 text-[9px] font-extrabold uppercase">
                  ADVOCATE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium whitespace-nowrap truncate flex items-center gap-1">
                <ShieldCheck size={11} className="text-emerald-400" /> Advocate SaaS Panel
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-none">
        {navItems.map((item) => (
          <SidebarLink key={item.id} item={item} collapsed={collapsed} />
        ))}

        <div className="my-3 mx-2 h-px bg-slate-800/80" />

        {bottomItems.map((item) => (
          <SidebarLink key={item.id} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Footer User Profile & Logout */}
      <div className="border-t border-slate-800/80 p-3 space-y-2 bg-slate-950/80">
        {!collapsed && user && (
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/90 border border-slate-800">
            <UserAvatar user={user} />
            <div className="overflow-hidden min-w-0">
              <p className="text-xs font-bold text-white truncate flex items-center gap-1">
                <span>{user.name?.startsWith('Adv.') ? user.name : `Adv. ${user.name || 'Professional'}`}</span>
              </p>
              <p className="text-[10px] text-indigo-300 truncate">{user.email}</p>
            </div>
          </div>
        )}

        {collapsed && user && (
          <div className="flex justify-center py-1">
            <UserAvatar user={user} size="sm" />
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer ${
            collapsed ? 'justify-center px-0' : ''
          }`}
          title={collapsed ? 'Logout Advocate Panel' : undefined}
        >
          <LogOut size={17} className="shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                Logout Advocate Session
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  )
}

export default function AdvocateSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  useEffect(() => {
    if (mobileOpen) onMobileClose?.()
  }, [])

  return (
    <>
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
        className="hidden lg:flex flex-col relative shrink-0 overflow-hidden z-30 border-r border-slate-800"
      >
        <AdvocateSidebarContent collapsed={collapsed} />

        <button
          onClick={onToggle}
          className="absolute -right-3 top-6 z-40 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-indigo-500 shadow-md transition-all cursor-pointer"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden"
              onClick={onMobileClose}
            />

            <motion.aside
              key="drawer"
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed left-0 top-0 z-50 h-full w-[240px] lg:hidden border-r border-slate-800 shadow-2xl"
            >
              <AdvocateSidebarContent collapsed={false} onClose={onMobileClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
