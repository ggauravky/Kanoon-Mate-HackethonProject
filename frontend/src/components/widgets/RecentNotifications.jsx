import { useState, useEffect } from 'react'
import { Bell, Check, Sparkles, Calendar, FileText, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { notificationsAPI } from '../../services/api'

const MOCK_WIDGET_NOTIFS = [
  {
    _id: 'n_1',
    title: '⚠️ Consumer Forum Reply Notice Due in 3 Days',
    type: 'Deadline Reminder',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    isRead: false,
  },
  {
    _id: 'n_2',
    title: 'AI Analysis Complete for Rent Agreement',
    type: 'AI Analysis Ready',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    isRead: false,
  },
  {
    _id: 'n_3',
    title: 'PDF Executive Legal Report Downloadable',
    type: 'Report Generated',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    isRead: true,
  },
]

export default function RecentNotifications({ limit = 3 }) {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    notificationsAPI
      .getNotifications()
      .then((res) => {
        const fetched = res.data?.data?.notifications || []
        setNotifications(fetched.length > 0 ? fetched : MOCK_WIDGET_NOTIFS)
      })
      .catch(() => {
        setNotifications(MOCK_WIDGET_NOTIFS)
      })
  }, [])

  return (
    <div className="space-y-3">
      {notifications.slice(0, limit).map((item) => (
        <div
          key={item._id}
          onClick={() => navigate('/dashboard/notifications')}
          className={`flex items-start justify-between gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
            !item.isRead
              ? 'border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50/70'
              : 'border-slate-200/80 bg-slate-50/50 hover:bg-white'
          }`}
        >
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="mt-0.5 p-1.5 rounded-lg bg-indigo-600 text-white shrink-0">
              <Bell size={13} />
            </div>
            <div className="min-w-0">
              <h4 className={`text-xs font-bold truncate ${!item.isRead ? 'text-indigo-950' : 'text-slate-800'}`}>
                {item.title}
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {!item.isRead && (
            <span className="h-2 w-2 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
          )}
        </div>
      ))}
    </div>
  )
}
