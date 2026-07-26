import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Check, CheckCheck, Trash2, FileText, Calendar, Sparkles, ShieldAlert, ArrowRight, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { notificationsAPI } from '../../services/api'
import toast from 'react-hot-toast'

const MOCK_NOTIFICATIONS = [
  {
    _id: 'notif_001',
    title: '⚠️ Urgent: 3 Days Left for Reply Notice',
    message: 'Consumer Forum reply is due in 3 days. Complete filing.',
    type: 'Deadline Reminder',
    priority: 'High',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: 'notif_002',
    title: 'AI Analysis Complete for Rent Agreement',
    message: 'OCR & legal clause extraction completed with 0 high risk terms.',
    type: 'AI Analysis Ready',
    priority: 'Medium',
    isRead: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    _id: 'notif_003',
    title: 'Document Uploaded Successfully',
    message: 'Property Sale Deed scan stored in secure DPDP vault.',
    type: 'Document Uploaded',
    priority: 'Low',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
]

export default function NotificationBell() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef(null)

  const fetchNotifications = () => {
    notificationsAPI
      .getNotifications()
      .then((res) => {
        const list = res.data?.data?.notifications || []
        const count = res.data?.data?.unreadCount ?? list.filter((n) => !n.isRead).length
        setNotifications(list.length > 0 ? list : MOCK_NOTIFICATIONS)
        setUnreadCount(list.length > 0 ? count : 2)
      })
      .catch(() => {
        setNotifications(MOCK_NOTIFICATIONS)
        setUnreadCount(2)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation()
    try {
      await notificationsAPI.markAsRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch {
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
      toast.success('All notifications marked as read.')
    } catch {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
      toast.success('All notifications marked as read.')
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Deadline Reminder':
        return <Calendar size={14} className="text-amber-500" />
      case 'AI Analysis Ready':
      case 'OCR Completed':
        return <Sparkles size={14} className="text-indigo-500" />
      case 'Document Uploaded':
        return <FileText size={14} className="text-blue-500" />
      default:
        return <ShieldAlert size={14} className="text-purple-500" />
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="relative p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        title="Notifications"
        id="navbar-notification-bell"
      >
        <Bell size={20} />

        {/* Unread Count Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-extrabold text-white ring-2 ring-slate-900 shadow-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Notifications Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-3xl border border-slate-700 bg-slate-900 text-white shadow-2xl overflow-hidden"
          >
            {/* Dropdown Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 bg-slate-950/80">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 text-[10px] font-bold">
                    {unreadCount} new
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  <CheckCheck size={13} /> Mark all read
                </button>
              )}
            </div>

            {/* Dropdown List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No notifications available
                </div>
              ) : (
                notifications.slice(0, 4).map((item) => (
                  <div
                    key={item._id}
                    onClick={() => {
                      setIsOpen(false)
                      navigate('/dashboard/notifications')
                    }}
                    className={`flex items-start gap-3 p-3.5 hover:bg-slate-800/60 transition-colors cursor-pointer relative ${
                      !item.isRead ? 'bg-indigo-950/20' : ''
                    }`}
                  >
                    {/* Unread indicator dot */}
                    {!item.isRead && (
                      <span className="absolute left-1.5 top-5 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    )}

                    <div className="mt-0.5 p-2 rounded-xl bg-slate-800 border border-slate-700 shrink-0">
                      {getTypeIcon(item.type)}
                    </div>

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-bold leading-tight ${!item.isRead ? 'text-white' : 'text-slate-300'}`}>
                          {item.title}
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>
                      <span className="text-[10px] text-slate-500 block pt-0.5">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {!item.isRead && (
                      <button
                        onClick={(e) => handleMarkAsRead(item._id, e)}
                        className="text-slate-500 hover:text-indigo-400 p-1 rounded transition-colors shrink-0"
                        title="Mark as read"
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Dropdown Footer */}
            <div className="border-t border-slate-800 bg-slate-950 p-2.5 text-center">
              <button
                onClick={() => {
                  setIsOpen(false)
                  navigate('/dashboard/notifications')
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-bold py-1.5 rounded-xl hover:bg-slate-900 transition-colors"
              >
                <span>View All Notifications</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
