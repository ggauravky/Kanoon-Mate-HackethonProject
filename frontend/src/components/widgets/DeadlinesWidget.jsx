import { motion } from 'framer-motion'
import { CalendarClock, AlertTriangle, Clock } from 'lucide-react'
import { mockDeadlines } from '../../data/mockData'

const statusConfig = {
  Urgent: {
    badgeCls: 'badge badge-red',
    icon: AlertTriangle,
    iconCls: 'text-[var(--color-danger)]',
    bg: 'bg-[var(--color-danger-50)]',
  },
  Upcoming: {
    badgeCls: 'badge badge-yellow',
    icon: Clock,
    iconCls: 'text-[var(--color-warning)]',
    bg: 'bg-[var(--color-warning-50)]',
  },
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export default function DeadlinesWidget({ limit = 3 }) {
  const items = mockDeadlines.slice(0, limit)

  return (
    <div className="flex flex-col gap-3">
      {items.map((dl, i) => {
        const cfg = statusConfig[dl.status] ?? statusConfig.Upcoming
        const Icon = cfg.icon
        return (
          <motion.div
            key={dl.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="flex items-start gap-3 p-3 rounded-xl border border-[var(--color-border-light)] hover:bg-[var(--color-surface-alt)] transition-colors"
          >
            {/* Icon */}
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${cfg.bg}`}>
              <Icon size={16} className={cfg.iconCls} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="text-sm font-semibold text-[var(--color-text)] truncate">{dl.title}</p>
                <span className={cfg.badgeCls}>{dl.status}</span>
              </div>
              <div className="mt-1 flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                <span className="flex items-center gap-1">
                  <CalendarClock size={11} />
                  {formatDate(dl.dueDate)}
                </span>
                <span
                  className={`font-semibold ${
                    dl.daysRemaining <= 5
                      ? 'text-[var(--color-danger)]'
                      : 'text-[var(--color-text-secondary)]'
                  }`}
                >
                  {dl.daysRemaining}d left
                </span>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
