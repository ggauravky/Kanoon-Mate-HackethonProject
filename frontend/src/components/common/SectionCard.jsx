import { motion } from 'framer-motion'

/**
 * SectionCard — white card wrapper with soft shadow and optional header.
 * Wraps widgets and content blocks on dashboard pages.
 */
export default function SectionCard({ title, action, children, className = '', noPad = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`card ${noPad ? '' : 'p-5'} ${className}`}
    >
      {(title || action) && (
        <div className={`flex items-center justify-between gap-3 ${noPad ? 'px-5 pt-5 pb-4' : 'mb-4'}`}>
          {title && (
            <h2 className="text-sm font-semibold text-[var(--color-text)] tracking-wide uppercase">
              {title}
            </h2>
          )}
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </motion.div>
  )
}
