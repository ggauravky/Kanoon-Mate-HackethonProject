import { motion } from 'framer-motion'
import { Calendar, Clock, AlertTriangle, CheckCircle2, FileText, Tag, Trash2, Check } from 'lucide-react'
import { calculateDeadlineMetrics } from '../../utils/dateExtractor'

export default function TimelineView({ reminders, onToggleStatus, onDelete }) {
  if (!reminders || reminders.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-2">
        <Calendar size={36} className="mx-auto text-slate-300" />
        <h3 className="text-sm font-bold text-slate-800">No Upcoming Deadlines Found</h3>
        <p className="text-xs text-slate-500">Add a new reminder or upload a legal document to auto-extract dates.</p>
      </div>
    )
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
      {reminders.map((item, index) => {
        const id = item._id || item.id
        const dueDate = item.dueDate
        const isCompleted = item.status === 'completed'
        const { daysRemaining, urgencyCode } = calculateDeadlineMetrics(dueDate)

        // Color theme mapping
        const colorStyle = (() => {
          if (isCompleted) return { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', text: 'Completed' }
          if (urgencyCode === 'expired') return { dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-700 border-slate-300', text: 'Expired' }
          if (urgencyCode === 'urgent') return { dot: 'bg-red-500', badge: 'bg-red-50 text-red-800 border-red-200', text: `🔴 ${daysRemaining} days left (Urgent)` }
          if (urgencyCode === 'warning') return { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-900 border-amber-200', text: `🟡 ${daysRemaining} days remaining` }
          return { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', text: `🟢 ${daysRemaining} days remaining` }
        })()

        return (
          <motion.div
            key={id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: index * 0.05 }}
            className="relative flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md hover:border-indigo-400 transition-all"
          >
            {/* Timeline node dot */}
            <span className={`absolute -left-[30px] top-6 h-3.5 w-3.5 rounded-full ring-4 ring-white ${colorStyle.dot}`} />

            <div className="space-y-2 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 uppercase">
                  {item.category || 'Reply Deadline'}
                </span>
                {item.extractedFromAI && (
                  <span className="rounded-md bg-purple-50 text-purple-700 px-2 py-0.5 text-[10px] font-bold border border-purple-200">
                    🤖 AI Extracted
                  </span>
                )}
              </div>

              <h4 className={`text-sm font-bold text-slate-900 ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                {item.title}
              </h4>

              {item.description && (
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{item.description}</p>
              )}

              <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1 font-mono font-semibold text-slate-700">
                  <Clock size={13} /> {new Date(dueDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                {item.documentId?.title && (
                  <span className="flex items-center gap-1 truncate max-w-[200px]">
                    <FileText size={13} className="text-indigo-600 shrink-0" /> {item.documentId.title}
                  </span>
                )}
              </div>
            </div>

            {/* Right side urgency badge & actions */}
            <div className="flex flex-col items-end gap-3 shrink-0">
              <span className={`rounded-full border px-3 py-1 text-xs font-bold ${colorStyle.badge}`}>
                {colorStyle.text}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleStatus(id, isCompleted ? 'pending' : 'completed')}
                  className={`p-1.5 rounded-xl border transition-colors ${
                    isCompleted
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-slate-200 text-slate-400 hover:border-emerald-500 hover:text-emerald-600'
                  }`}
                  title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
                >
                  <Check size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(id)}
                  className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Delete Reminder"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
