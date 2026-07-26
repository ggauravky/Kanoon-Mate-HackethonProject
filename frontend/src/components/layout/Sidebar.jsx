import { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  FileText,
  Upload,
  Bot,
  CalendarClock,
  History,
  Settings,
  UserCircle,
  LogOut,
  Scale,
  ChevronLeft,
  ChevronRight,
  X,
  FileCheck2,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

// ─── Nav Items ─────────────────────────────────────────────────────────────────
const navItems = [
  { id: 'dashboard',  label: 'Dashboard',      icon: LayoutDashboard, to: '/dashboard',           end: true  },
  { id: 'documents',  label: 'My Documents',   icon: FileText,        to: '/dashboard/documents'              },
  { id: 'upload',     label: 'Upload Document',icon: Upload,           to: '/dashboard/upload'                },
  { id: 'reports',    label: 'Legal Reports',  icon: FileCheck2,      to: '/dashboard/reports'               },
  { id: 'chat',       label: 'AI Assistant',   icon: Bot,             to: '/dashboard/chat'                  },
  { id: 'deadlines',  label: 'Deadlines',      icon: CalendarClock,   to: '/dashboard/deadlines'             },
  { id: 'history',    label: 'History',         icon: History,         to: '/dashboard/history'               },
]

const bottomItems = [
  { id: 'settings', label: 'Settings', icon: Settings, to: '/dashboard/settings' },
  { id: 'profile',  label: 'Profile',  icon: UserCircle, to: '/dashboard/profile' },
]

// ─── Sidebar Link ──────────────────────────────────────────────────────────────
function SidebarLink({ item, collapsed }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-0' : ''}`
      }
      title={collapsed ? item.label : undefined}
    >
      {({ isActive }) => (
        <>
          <item.icon size={18} className={`shrink-0 ${isActive ? 'text-white' : ''}`} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>
        </>
      )}
    </NavLink>
  )
}

// ─── User Avatar ───────────────────────────────────────────────────────────────
function UserAvatar({ user, size = 'md' }) {
  const initials = user?.name
    ?.split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? 'U'

  const sizeClass = size === 'sm' ? 'h-7 w-7 text-xs' : 'h-9 w-9 text-sm'

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] font-semibold text-white ${sizeClass}`}
    >
      {initials}
    </div>
  )
}

// ─── Sidebar Inner Content ─────────────────────────────────────────────────────
function SidebarContent({ collapsed, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <div
      className="flex h-full flex-col"
      style={{ backgroundColor: 'var(--color-sidebar-bg)' }}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${collapsed ? 'justify-center px-2' : ''}`}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]">
          <Scale size={16} className="text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <span className="text-white font-bold text-base whitespace-nowrap">Kanoon-Mate</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto text-[var(--color-sidebar-text)] hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <SidebarLink key={item.id} item={item} collapsed={collapsed} />
        ))}

        {/* Divider */}
        <div className="my-3 h-px bg-white/10" />

        {bottomItems.map((item) => (
          <SidebarLink key={item.id} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-white/10 p-3 space-y-1">
        {/* User row */}
        {!collapsed && user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2.5 px-2 py-2 rounded-lg mb-1"
          >
            <UserAvatar user={user} />
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-[var(--color-sidebar-text)] truncate">{user.email}</p>
            </div>
          </motion.div>
        )}
        {collapsed && user && (
          <div className="flex justify-center mb-1">
            <UserAvatar user={user} size="sm" />
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`sidebar-link w-full ${collapsed ? 'justify-center px-0' : ''} hover:!bg-red-500/20 hover:!text-red-400`}
          title={collapsed ? 'Logout' : undefined}
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
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  )
}

// ─── Main Sidebar Export ───────────────────────────────────────────────────────
export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  // Close drawer on route change (mobile)
  useEffect(() => {
    if (mobileOpen) onMobileClose?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {/* ── Desktop Sidebar ───────────────────────────────────────────── */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 240 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className={`hidden lg:flex flex-col relative shrink-0 overflow-hidden`}
        style={{ boxShadow: 'var(--shadow-sidebar)' }}
      >
        <SidebarContent collapsed={collapsed} />

        {/* Collapse Toggle */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-[72px] z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-[var(--color-border)] shadow-md text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all duration-150"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </motion.aside>

      {/* ── Mobile Drawer Overlay ─────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={onMobileClose}
            />

            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed left-0 top-0 z-50 h-full w-[240px] lg:hidden"
              style={{ boxShadow: 'var(--shadow-sidebar)' }}
            >
              <SidebarContent collapsed={false} onClose={onMobileClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
