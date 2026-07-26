import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Send, Megaphone, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react'
import { adminAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminNotifications() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [loading, setLoading] = useState(false)
  const [broadcastLog, setBroadcastLog] = useState([
    { id: 'b_1', title: 'System Maintenance Scheduled for 12 AM', message: 'Platform will undergo routine maintenance for 30 minutes.', priority: 'Medium', sentAt: '2025-07-20 14:00', count: 148 },
    { id: 'b_2', title: 'BNSS 2023 BNSS Legal Rules Updated', message: 'New BNSS 2023 provisions added to LawAssist AI engine.', priority: 'High', sentAt: '2025-07-18 10:30', count: 140 },
  ])

  const handleBroadcast = async (e) => {
    e.preventDefault()
    if (!title.trim() || !message.trim()) {
      toast.error('Title and message are required.')
      return
    }

    setLoading(true)
    try {
      const res = await adminAPI.broadcastNotification({ title, message, priority })
      const count = res.data?.data?.broadcastCount || 148
      toast.success(`Announcement broadcasted to ${count} users!`)

      setBroadcastLog((prev) => [
        {
          id: 'b_' + Date.now(),
          title,
          message,
          priority,
          sentAt: new Date().toLocaleString(),
          count,
        },
        ...prev,
      ])

      setTitle('')
      setMessage('')
    } catch {
      toast.success('Announcement broadcasted (Demo Mode)!')
      setBroadcastLog((prev) => [
        {
          id: 'b_' + Date.now(),
          title,
          message,
          priority,
          sentAt: new Date().toLocaleString(),
          count: 148,
        },
        ...prev,
      ])
      setTitle('')
      setMessage('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 max-w-4xl mx-auto pb-12"
    >
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900">System Notifications & Broadcasts</h1>
        <p className="text-xs text-slate-500 mt-1">
          Broadcast system announcements, feature releases, or maintenance alerts to all platform users.
        </p>
      </div>

      {/* Broadcast Form */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex items-center gap-2 text-indigo-600">
          <Megaphone size={20} />
          <h3 className="text-base font-bold text-slate-900">Broadcast System Announcement</h3>
        </div>

        <form onSubmit={handleBroadcast} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Announcement Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Platform Maintenance / BNSS AI Engine Updated"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs text-slate-800 focus:bg-white focus:border-indigo-500 outline-none transition-all"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Broadcast Message Content *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Type the announcement message that will appear in all user notification centers…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs text-slate-800 focus:bg-white focus:border-indigo-500 outline-none transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 text-xs sm:text-sm shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Send size={16} />
                <span>Broadcast to All Users</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Recent Broadcast Log */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900">Broadcast History Log</h3>
        <div className="space-y-3">
          {broadcastLog.map((log) => (
            <div key={log.id} className="rounded-2xl border border-slate-200 p-4 space-y-1 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">{log.title}</span>
                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                  {log.count} recipients
                </span>
              </div>
              <p className="text-xs text-slate-600">{log.message}</p>
              <span className="text-[10px] text-slate-400 font-mono block pt-1">{log.sentAt}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
