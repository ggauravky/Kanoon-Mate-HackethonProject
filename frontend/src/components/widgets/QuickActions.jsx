import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Upload, Bot, History, CalendarClock } from 'lucide-react'

const actions = [
  {
    id: 'upload',
    label: 'Upload Document',
    description: 'Analyse a new legal document',
    icon: Upload,
    to: '/dashboard/upload',
    color: 'primary',
  },
  {
    id: 'chat',
    label: 'Chat with AI',
    description: 'Ask your legal questions instantly',
    icon: Bot,
    to: '/dashboard/chat',
    color: 'accent',
  },
  {
    id: 'history',
    label: 'View History',
    description: 'Browse past analyses and chats',
    icon: History,
    to: '/dashboard/history',
    color: 'purple',
  },
  {
    id: 'deadlines',
    label: 'Deadlines',
    description: 'Track upcoming legal deadlines',
    icon: CalendarClock,
    to: '/dashboard/deadlines',
    color: 'warning',
  },
]

const colorStyles = {
  primary: {
    icon: 'text-[var(--color-primary)]',
    bg: 'bg-[var(--color-primary-50)]',
    hover: 'hover:border-[var(--color-primary)]',
    ring: 'group-hover:ring-[var(--color-primary-100)]',
  },
  accent: {
    icon: 'text-[var(--color-accent)]',
    bg: 'bg-[var(--color-accent-50)]',
    hover: 'hover:border-[var(--color-accent)]',
    ring: 'group-hover:ring-[var(--color-accent-100)]',
  },
  purple: {
    icon: 'text-[var(--color-purple)]',
    bg: 'bg-[var(--color-purple-50)]',
    hover: 'hover:border-[var(--color-purple)]',
    ring: 'group-hover:ring-[var(--color-purple-100)]',
  },
  warning: {
    icon: 'text-[var(--color-warning)]',
    bg: 'bg-[var(--color-warning-50)]',
    hover: 'hover:border-[var(--color-warning)]',
    ring: 'group-hover:ring-[var(--color-warning-100)]',
  },
}

export default function QuickActions() {
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {actions.map((action, i) => {
        const Icon = action.icon
        const c = colorStyles[action.color]
        return (
          <motion.button
            key={action.id}
            onClick={() => navigate(action.to)}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
            className={`group card p-4 flex flex-col items-start gap-3 text-left cursor-pointer border border-transparent transition-all duration-200 ${c.hover}`}
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ring-4 ring-transparent ${c.bg} ${c.ring} transition-all duration-200`}>
              <Icon size={19} className={c.icon} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">{action.label}</p>
              <p className="mt-0.5 text-xs text-[var(--color-text-muted)] leading-relaxed">{action.description}</p>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
