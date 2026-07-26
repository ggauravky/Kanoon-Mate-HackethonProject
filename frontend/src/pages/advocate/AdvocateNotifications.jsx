import { useState } from 'react'
import { Bell, Sparkles, Star, ShieldCheck, Check } from 'lucide-react'

export default function AdvocateNotifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New AI Client Match Available',
      message: 'Property Agreement analysis matched your Lucknow practice specialization (98% Match).',
      time: '10 mins ago',
      type: 'match',
    },
    {
      id: 2,
      title: 'Client Review Received',
      message: 'Sanjay Gupta left a 5-star review: "Excellent guidance regarding property registration."',
      time: '2 hours ago',
      type: 'review',
    },
    {
      id: 3,
      title: 'Bar Verification Status Confirmed',
      message: 'Your Bar Council registration BCI-DL-88412 is fully verified in LawAssist AI directory.',
      time: '1 day ago',
      type: 'status',
    },
  ])

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Bell className="text-indigo-400" /> Advocate Notifications & Alerts
        </h1>
        <p className="text-xs text-slate-400">
          Real-time alerts for new AI matches, client consultation requests, and profile updates.
        </p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div key={n.id} className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                {n.type === 'match' ? (
                  <Sparkles size={14} className="text-indigo-400" />
                ) : n.type === 'review' ? (
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                ) : (
                  <ShieldCheck size={14} className="text-emerald-400" />
                )}
                {n.title}
              </span>
              <span className="text-[10px] text-slate-500">{n.time}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
