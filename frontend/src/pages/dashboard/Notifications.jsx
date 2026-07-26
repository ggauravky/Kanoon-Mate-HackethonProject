import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  CheckCheck,
  Check,
  Trash2,
  FileText,
  Calendar,
  Sparkles,
  FileCheck,
  ExternalLink,
  Clock,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import { notificationsAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function Notifications() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')

  const fetchNotifications = () => {
    setLoading(true)
    notificationsAPI
      .getNotifications()
      .then((res) => {
        const list = res.data?.data?.notifications || []
        setNotifications(list)
      })
      .catch((err) => {
        toast.error('Failed to load notifications.')
        setNotifications([])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      )
      toast.success('Notification marked as read.')
    } catch (err) {
      toast.error(err.message || 'Failed to mark notification as read.')
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      toast.success('All notifications marked as read.')
    } catch (err) {
      toast.error(err.message || 'Failed to mark all notifications as read.')
    }
  }

  const handleDelete = async (id) => {
    try {
      await notificationsAPI.deleteNotification(id)
      setNotifications((prev) => prev.filter((n) => n._id !== id))
      toast.success('Notification deleted.')
    } catch (err) {
      toast.error(err.message || 'Failed to delete notification.')
    }
  }

  const filteredNotifs = notifications.filter((item) => {
    if (activeFilter === 'Unread') return !item.isRead
    if (activeFilter === 'Deadlines') return item.type === 'Deadline Reminder'
    if (activeFilter === 'AI') return item.type === 'AI Analysis Ready' || item.type === 'OCR Completed'
    if (activeFilter === 'Reports') return item.type === 'Report Generated'
    if (activeFilter === 'System') return item.type === 'System Alert' || item.type === 'Document Uploaded'
    return true
  })

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical':
        return <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-red-100 text-red-800 border border-red-200 uppercase">Critical</span>
      case 'High':
        return <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-100 text-amber-900 border border-amber-200 uppercase">High</span>
      case 'Medium':
        return <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 uppercase">Medium</span>
      default:
        return <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-slate-100 text-slate-700 border border-slate-200 uppercase">Low</span>
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Deadline Reminder':
        return <Calendar size={18} className="text-amber-500" />
      case 'AI Analysis Ready':
      case 'OCR Completed':
        return <Sparkles size={18} className="text-indigo-500" />
      case 'Report Generated':
        return <FileCheck size={18} className="text-emerald-500" />
      default:
        return <FileText size={18} className="text-blue-500" />
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header with Mark All Read CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Notification Center"
          subtitle="Stay informed about legal deadlines, document status, and AI insights."
        />

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold px-4 py-2.5 text-xs shadow-xs transition-all shrink-0 self-start sm:self-center cursor-pointer"
          >
            <CheckCheck size={16} className="text-indigo-600" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        {['All', 'Unread', 'Deadlines', 'AI', 'Reports', 'System'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeFilter === tab
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : filteredNotifs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-3"
        >
          <Bell size={40} className="mx-auto text-slate-300" />
          <h3 className="text-sm font-bold text-slate-800">No Notifications Found</h3>
          <p className="text-xs text-slate-500">You're all caught up! Upload documents or set legal deadlines to receive alerts.</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredNotifs.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className={`rounded-2xl border p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  !item.isRead
                    ? 'border-indigo-200 bg-indigo-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs shrink-0 mt-0.5">
                    {getTypeIcon(item.type)}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-bold ${!item.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                        {item.title}
                      </h4>
                      {getPriorityBadge(item.priority)}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock size={12} /> {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {item.relatedDocument && (
                        <button
                          onClick={() => navigate(`/dashboard/analysis/${item.relatedDocument._id || item.relatedDocument}`)}
                          className="flex items-center gap-1 text-indigo-600 font-semibold hover:underline cursor-pointer"
                        >
                          <ExternalLink size={12} /> {item.relatedDocument.title || 'View Related Document'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {!item.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(item._id)}
                      className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-bold px-3 py-1.5 rounded-xl border border-indigo-100 bg-white hover:bg-indigo-50 transition-colors cursor-pointer"
                    >
                      <Check size={14} /> Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                    title="Delete Notification"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
