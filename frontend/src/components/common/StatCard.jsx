import { motion } from 'framer-motion'
import {
  FileText, Bot, CalendarClock, BookMarked,
  TrendingUp, TrendingDown, Minus,
} from 'lucide-react'

const iconMap = {
  FileText,
  Bot,
  CalendarClock,
  BookMarked,
}

const colorMap = {
  primary: {
    icon: 'text-[var(--color-primary)]',
    bg: 'bg-[var(--color-primary-50)]',
    ring: 'ring-[var(--color-primary-100)]',
  },
  accent: {
    icon: 'text-[var(--color-accent)]',
    bg: 'bg-[var(--color-accent-50)]',
    ring: 'ring-[var(--color-accent-100)]',
  },
  warning: {
    icon: 'text-[var(--color-warning)]',
    bg: 'bg-[var(--color-warning-50)]',
    ring: 'ring-[var(--color-warning-100)]',
  },
  purple: {
    icon: 'text-[var(--color-purple)]',
    bg: 'bg-[var(--color-purple-50)]',
    ring: 'ring-[var(--color-purple-100)]',
  },
}

function TrendBadge({ trend }) {
  if (trend === 0)
    return (
      <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
        <Minus size={12} /> No change
      </span>
    )
  const positive = trend > 0
  return (
    <span
      className={`flex items-center gap-1 text-xs font-medium ${
        positive ? 'text-[var(--color-accent)]' : 'text-[var(--color-danger)]'
      }`}
    >
      {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {positive ? '+' : ''}{trend} this month
    </span>
  )
}

/**
 * StatCard — reusable metric card
 * @param {string} label
 * @param {number} value
 * @param {number} trend
 * @param {string} icon   — key from iconMap
 * @param {string} color  — key from colorMap
 * @param {number} index  — for staggered animation
 */
export default function StatCard({ label, value, trend, icon, color = 'primary', index = 0 }) {
  const Icon = iconMap[icon] ?? FileText
  const c = colorMap[color] ?? colorMap.primary

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -2, boxShadow: '0 8px 24px rgb(0 0 0 / 0.08)' }}
      className="card p-5 flex items-start gap-4 cursor-default select-none"
    >
      {/* Icon */}
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-4 ${c.bg} ${c.ring}`}>
        <Icon size={20} className={c.icon} />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1">
        <p className="text-sm text-[var(--color-text-secondary)] font-medium">{label}</p>
        <p className="text-2xl font-bold text-[var(--color-text)]">{value}</p>
        <TrendBadge trend={trend} />
      </div>
    </motion.div>
  )
}
