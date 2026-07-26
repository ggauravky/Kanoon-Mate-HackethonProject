import { motion } from 'framer-motion'

/**
 * PageHeader — consistent page title + optional subtitle
 * Used at the top of every dashboard page.
 */
export default function PageHeader({ title, subtitle, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start justify-between gap-4 mb-6"
    >
      <div>
        <h1 className="text-xl font-bold text-[var(--color-text)] sm:text-2xl">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </motion.div>
  )
}
