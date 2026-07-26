import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, Menu, Moon, Sun, Scale } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function UserAvatar({ user }) {
  const initials = user?.name
    ?.split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? 'U'

  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-xs font-semibold text-white shrink-0 cursor-pointer">
      {initials}
    </div>
  )
}

function NotificationDot() {
  return (
    <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[var(--color-danger)] ring-2 ring-white" />
  )
}

/**
 * TopNavbar
 * Props:
 *  onMenuToggle {fn}  — opens mobile sidebar drawer
 */
export default function TopNavbar({ onMenuToggle }) {
  const { user } = useAuth()
  const [dark, setDark] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--color-border-light)] bg-[var(--color-surface)] px-4 shadow-sm">

      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuToggle}
        className="btn-ghost p-2 lg:hidden"
        aria-label="Open navigation"
        id="mobile-menu-btn"
      >
        <Menu size={20} />
      </button>

      {/* Logo — mobile only (desktop logo is in sidebar) */}
      <div className="flex items-center gap-2 lg:hidden">
        <Scale size={18} className="text-[var(--color-primary)]" />
        <span className="text-sm font-bold text-[var(--color-text)]">LawAssist AI</span>
      </div>

      {/* Search Bar */}
      <motion.div
        animate={{ width: searchFocused ? '100%' : 'auto' }}
        transition={{ duration: 0.2 }}
        className="relative hidden sm:flex flex-1 max-w-xs items-center"
      >
        <Search
          size={15}
          className="absolute left-3 text-[var(--color-text-muted)] pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search documents, cases…"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] py-2 pl-8 pr-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200"
          id="dashboard-search"
        />
      </motion.div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-1">

        {/* Theme Toggle */}
        <button
          onClick={() => setDark((d) => !d)}
          className="btn-ghost p-2 rounded-lg relative"
          aria-label="Toggle theme"
          id="theme-toggle-btn"
          title="Theme toggle (UI placeholder)"
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

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="btn-ghost p-2 rounded-lg relative"
            aria-label="Notifications"
            id="notif-btn"
          >
            <Bell size={18} />
            <NotificationDot />
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-11 z-50 w-72 card-md overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-[var(--color-border-light)]">
                  <p className="text-sm font-semibold text-[var(--color-text)]">Notifications</p>
                </div>
                {[
                  { text: 'Reply to Consumer Forum Notice is due in 4 days', time: '2h ago', urgent: true },
                  { text: 'AI analysis complete for "Employment Agreement"', time: '5h ago', urgent: false },
                  { text: 'Rent Agreement renewal approaching — 15 days left', time: '1d ago', urgent: false },
                ].map((n, i) => (
                  <div
                    key={i}
                    className="flex gap-3 px-4 py-3 hover:bg-[var(--color-surface-alt)] transition-colors cursor-pointer border-b border-[var(--color-border-light)] last:border-0"
                  >
                    <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${n.urgent ? 'bg-[var(--color-danger)]' : 'bg-[var(--color-accent)]'}`} />
                    <div>
                      <p className="text-xs text-[var(--color-text)] leading-relaxed">{n.text}</p>
                      <p className="mt-1 text-xs text-[var(--color-text-muted)]">{n.time}</p>
                    </div>
                  </div>
                ))}
                <div className="px-4 py-2.5 text-center">
                  <button className="text-xs text-[var(--color-primary)] font-medium hover:underline">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-[var(--color-border)] mx-1" />

        {/* User */}
        <div className="flex items-center gap-2 pl-1 cursor-pointer group" id="user-menu">
          <UserAvatar user={user} />
          {user && (
            <div className="hidden md:block">
              <p className="text-xs font-semibold text-[var(--color-text)] leading-none">{user.name?.split(' ')[0]}</p>
              <p className="text-[10px] text-[var(--color-text-muted)] leading-none mt-0.5">{user.plan} Plan</p>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
