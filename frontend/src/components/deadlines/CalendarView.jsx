import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react'
import { calculateDeadlineMetrics } from '../../utils/dateExtractor'

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function CalendarView({ reminders }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDayReminders, setSelectedDayReminders] = useState([])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Calendar matrix calculations
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  // Find deadlines for a specific day number
  const getRemindersForDay = (dayNum) => {
    const targetDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
    return reminders.filter((r) => {
      if (!r.dueDate) return false
      const rDateStr = new Date(r.dueDate).toISOString().split('T')[0]
      return rDateStr === targetDateStr
    })
  }

  return (
    <div className="space-y-6">
      {/* Calendar Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        {/* Month Navigation Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon size={20} className="text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">
              {MONTH_NAMES[month]} {year}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Today
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center border-b border-slate-100 pb-2">
          {DAYS_OF_WEEK.map((d) => (
            <span key={d} className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {d}
            </span>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {/* Empty cells before 1st day */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-20 sm:h-24 rounded-xl bg-slate-50/50 p-1.5 opacity-30" />
          ))}

          {/* Days of current month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1
            const dayReminders = getRemindersForDay(dayNum)
            const isToday =
              new Date().getDate() === dayNum &&
              new Date().getMonth() === month &&
              new Date().getFullYear() === year

            return (
              <div
                key={`day-${dayNum}`}
                onClick={() => setSelectedDayReminders(dayReminders)}
                className={`h-20 sm:h-24 rounded-xl border p-1.5 sm:p-2 flex flex-col justify-between transition-all cursor-pointer ${
                  isToday
                    ? 'border-indigo-500 bg-indigo-50/40 ring-1 ring-indigo-500'
                    : dayReminders.length > 0
                    ? 'border-slate-300 bg-white hover:border-indigo-400 hover:shadow-xs'
                    : 'border-slate-100 bg-slate-50/30 text-slate-400 hover:bg-slate-100/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isToday ? 'text-indigo-600' : 'text-slate-700'}`}>
                    {dayNum}
                  </span>
                  {dayReminders.length > 0 && (
                    <span className="h-2 w-2 rounded-full bg-indigo-600" />
                  )}
                </div>

                {/* Deadline Pills preview inside cell */}
                <div className="space-y-1 overflow-hidden">
                  {dayReminders.slice(0, 2).map((r, idx) => {
                    const { urgencyCode } = calculateDeadlineMetrics(r.dueDate)
                    const pillBg =
                      urgencyCode === 'urgent'
                        ? 'bg-red-500 text-white'
                        : urgencyCode === 'warning'
                        ? 'bg-amber-500 text-white'
                        : urgencyCode === 'expired'
                        ? 'bg-slate-400 text-white'
                        : 'bg-emerald-600 text-white'

                    return (
                      <div
                        key={idx}
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md truncate ${pillBg}`}
                      >
                        {r.title}
                      </div>
                    )
                  })}
                  {dayReminders.length > 2 && (
                    <p className="text-[9px] text-slate-400 font-semibold pl-1">
                      +{dayReminders.length - 2} more
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected Day Details Panel */}
      {selectedDayReminders.length > 0 && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-5 space-y-3">
          <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-2">
            <Clock size={15} /> Deadlines Scheduled for Selected Date
          </h4>
          <div className="space-y-2">
            {selectedDayReminders.map((r, i) => (
              <div key={i} className="rounded-xl border border-indigo-200 bg-white p-3 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-slate-900">{r.title}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">{r.category} • {r.description || 'No notes'}</p>
                </div>
                <span className="font-mono text-xs font-bold text-indigo-700">
                  {new Date(r.dueDate).toLocaleDateString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
