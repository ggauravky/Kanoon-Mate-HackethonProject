import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Menu, Moon, Sun, Scale } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import NotificationBell from '../notifications/NotificationBell'

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

/**
 * TopNavbar
 * Props:
 *  onMenuToggle {fn}  — opens mobile sidebar drawer
 */
export default function TopNavbar({ onMenuToggle }) {
  const { user } = useAuth()
  const [dark, setDark] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

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
          title="Theme toggle"
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

        {/* Smart Notification Bell & Dropdown */}
        <NotificationBell />

        {/* Divider */}
        <div className="h-6 w-px bg-[var(--color-border)] mx-1" />

        {/* User */}
        <div className="flex items-center gap-2 pl-1 cursor-pointer group" id="user-menu">
          <UserAvatar user={user} />
          {user && (
            <div className="hidden md:block">
              <p className="text-xs font-semibold text-[var(--color-text)] leading-none">
                {user.name?.split(' ')[0]}
              </p>
              <p className="text-[10px] text-[var(--color-text-muted)] leading-none mt-0.5">
                {user.plan || 'Pro'} Plan
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
