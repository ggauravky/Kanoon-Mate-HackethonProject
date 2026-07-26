import { motion } from 'framer-motion'

/**
 * SectionCard — white card wrapper with soft shadow and optional header.
 * Wraps widgets and content blocks on dashboard pages.
 */
export default function SectionCard({ title, action, children, className = '', noPad = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`rounded-3xl border border-slate-200 bg-white shadow-xs transition-shadow duration-200 ${noPad ? '' : 'p-6'} ${className}`}
    >
      {(title || action) && (
        <div className={`flex items-center justify-between gap-3 ${noPad ? 'px-6 pt-6 pb-4 border-b border-slate-100' : 'mb-5'}`}>
          {title && (
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
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
