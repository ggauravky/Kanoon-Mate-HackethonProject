import { useState, useEffect } from 'react'
import { Bell, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { notificationsAPI } from '../../services/api'

export default function RecentNotifications({ limit = 3 }) {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    notificationsAPI
      .getNotifications()
      .then((res) => {
        const fetched = res.data?.data?.notifications || []
        if (isMounted) {
          setNotifications(fetched)
        }
      })
      .catch(() => {
        if (isMounted) setNotifications([])
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="flex h-20 items-center justify-center text-xs text-slate-500 font-medium">
        Loading notifications...
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center space-y-1">
        <Bell size={20} className="mx-auto text-slate-300" />
        <p className="text-xs font-semibold text-slate-600">No new notifications</p>
      </div>
    )
  }

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
