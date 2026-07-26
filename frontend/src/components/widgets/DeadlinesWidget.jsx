import { useState, useEffect } from 'react'
import { CalendarClock, AlertCircle, CheckCircle2, ChevronRight, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { remindersAPI } from '../../services/api'
import { calculateDeadlineMetrics } from '../../utils/dateExtractor'
import { mockDeadlines } from '../../data/mockData'

export default function DeadlinesWidget({ limit = 3 }) {
  const navigate = useNavigate()
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    remindersAPI
      .getReminders()
      .then((res) => {
        const fetched = res.data?.data?.reminders || []
        if (isMounted) {
          setReminders(fetched.length > 0 ? fetched : mockDeadlines)
        }
      })
      .catch(() => {
        if (isMounted) setReminders(mockDeadlines)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const displayList = reminders.slice(0, limit)

  const getUrgencyBadge = (dueDateStr) => {
    const { daysRemaining, urgencyCode } = calculateDeadlineMetrics(dueDateStr)

    if (urgencyCode === 'expired') {
      return <span className="badge badge-gray border border-slate-300">Expired</span>
    }
    if (urgencyCode === 'urgent') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 text-red-800 border border-red-200 px-2.5 py-0.5 text-[10px] font-bold">
          🔴 {daysRemaining} days left (Urgent)
        </span>
      )
    }
    if (urgencyCode === 'warning') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold">
          🟡 {daysRemaining} days left
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold">
        🟢 {daysRemaining} days left
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex h-24 items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {displayList.map((item) => {
        const id = item._id || item.id
        const title = item.title
        const dueDate = item.dueDate || item.dueDateStr

        return (
          <div
            key={id}
            onClick={() => navigate('/dashboard/deadlines')}
            className="group flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 hover:bg-white hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                <CalendarClock size={16} />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                  {title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1 font-mono">
                  <Clock size={11} /> {new Date(dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {getUrgencyBadge(dueDate)}
              <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
