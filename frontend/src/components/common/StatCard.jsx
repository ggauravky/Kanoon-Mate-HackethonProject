import { motion } from 'framer-motion'
import {
  FileText, Bot, CalendarClock, BookMarked, Sparkles, FileCheck2,
} from 'lucide-react'

const iconMap = {
  FileText,
  Bot,
  CalendarClock,
  BookMarked,
  Sparkles,
  FileCheck2,
}

const colorMap = {
  blue: {
    icon: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-100',
    badge: 'bg-blue-100 text-blue-800',
  },
  green: {
    icon: 'text-emerald-600',
    bg: 'bg-emerald-50 border-emerald-100',
    badge: 'bg-emerald-100 text-emerald-800',
  },
  yellow: {
    icon: 'text-amber-600',
    bg: 'bg-amber-50 border-amber-100',
    badge: 'bg-amber-100 text-amber-800',
  },
  purple: {
    icon: 'text-purple-600',
    bg: 'bg-purple-50 border-purple-100',
    badge: 'bg-purple-100 text-purple-800',
  },
}

export default function StatCard({ label, value, change, icon, color = 'blue', index = 0 }) {
  const IconComponent = typeof icon === 'string' ? iconMap[icon] ?? FileText : icon ?? FileText
  const theme = colorMap[color] ?? colorMap.blue

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -3, boxShadow: '0 12px 24px -6px rgba(0, 0, 0, 0.08)' }}
      className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 cursor-default"
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${theme.bg} transition-transform duration-200 group-hover:scale-110`}>
          <IconComponent size={20} className={theme.icon} />
        </div>
        {change && (
          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${theme.badge}`}>
            {change}
          </span>
        )}
      </div>

      <div>
        <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</p>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">{label}</p>
      </div>
    </motion.div>
  )
}
