import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Calendar, Check, Power, ShieldAlert, Globe, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function AdvocateAvailability() {
  const [schedule, setSchedule] = useState({
    Monday: '09:00 AM - 06:00 PM',
    Tuesday: '09:00 AM - 06:00 PM',
    Wednesday: '09:00 AM - 06:00 PM',
    Thursday: '09:00 AM - 06:00 PM',
    Friday: '09:00 AM - 06:00 PM',
    Saturday: '10:00 AM - 02:00 PM',
    Sunday: 'Closed',
  })

  const [online, setOnline] = useState(true)
  const [offline, setOffline] = useState(true)
  const [vacationMode, setVacationMode] = useState(false)

  const handleSave = () => {
    toast.success('Availability schedule saved successfully!')
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Clock className="text-indigo-400" /> Availability & Working Hours
          </h1>
          <p className="text-xs text-slate-400">
            Set your weekly chamber consultation schedule and consultation mode availability.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2.5 px-5 text-xs shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Check size={15} /> Save Schedule
        </button>
      </div>

      {/* Mode Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Globe size={14} className="text-indigo-400" /> Online Video Consultations
            </span>
            <input
              type="checkbox"
              checked={online}
              onChange={(e) => setOnline(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
            />
          </div>
          <p className="text-[11px] text-slate-400">Available for remote digital video inquiries.</p>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <MapPin size={14} className="text-emerald-400" /> Chamber In-Person Office
            </span>
            <input
              type="checkbox"
              checked={offline}
              onChange={(e) => setOffline(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
            />
          </div>
          <p className="text-[11px] text-slate-400">In-person chamber visits allowed.</p>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Power size={14} className="text-rose-400" /> Vacation / Away Mode
            </span>
            <input
              type="checkbox"
              checked={vacationMode}
              onChange={(e) => setVacationMode(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-rose-600 focus:ring-rose-500"
            />
          </div>
          <p className="text-[11px] text-slate-400">Temporarily pause new inquiries.</p>
        </div>
      </div>

      {/* Weekly Days List */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400 mb-2">
          Weekly Chamber Operating Hours
        </h2>

        {DAYS.map((day) => (
          <div key={day} className="flex items-center justify-between gap-4 py-2 border-b border-slate-800/60 text-xs">
            <span className="font-bold text-white w-28">{day}</span>
            <input
              type="text"
              value={schedule[day]}
              onChange={(e) => setSchedule({ ...schedule, [day]: e.target.value })}
              className="flex-1 max-w-xs rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
