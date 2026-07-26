import { ShieldAlert, PhoneCall, AlertTriangle } from 'lucide-react'

export default function EmergencyBanner() {
  const emergencyHelplines = [
    { title: 'Emergency (Police/Fire/Medical)', number: '112', bg: 'bg-red-600' },
    { title: 'Women Helpline', number: '181', bg: 'bg-rose-600' },
    { title: 'Cyber Crime Portal', number: '1930', bg: 'bg-indigo-600' },
    { title: 'Childline Emergency', number: '1098', bg: 'bg-amber-600' },
    { title: 'Consumer Helpline', number: '1915', bg: 'bg-emerald-600' },
  ]

  return (
    <div className="rounded-3xl border border-red-200 bg-gradient-to-r from-red-50 via-rose-50 to-amber-50 p-5 space-y-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-red-600 text-white shrink-0 shadow-sm animate-pulse">
            <ShieldAlert size={22} />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-900 uppercase tracking-wider">
              <AlertTriangle size={14} className="text-red-600" /> National Emergency Legal & Safety Helplines
            </span>
            <p className="text-xs text-red-700 mt-0.5">
              Immediate 24/7 assistance across India. Free toll-free emergency call services.
            </p>
          </div>
        </div>

        <a
          href="tel:112"
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 text-xs font-bold shadow-sm transition-all"
        >
          <PhoneCall size={15} />
          <span>Call 112 Emergency</span>
        </a>
      </div>

      {/* Helpline Chips Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
        {emergencyHelplines.map((item, idx) => (
          <a
            key={idx}
            href={`tel:${item.number}`}
            className="flex items-center justify-between gap-2 rounded-2xl border border-red-200/80 bg-white/90 hover:bg-white p-3 shadow-2xs hover:shadow-xs transition-all text-slate-900 group"
          >
            <div className="overflow-hidden">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                {item.title}
              </span>
              <span className="text-sm font-extrabold text-red-700 font-mono">{item.number}</span>
            </div>
            <div className={`p-1.5 rounded-xl ${item.bg} text-white shrink-0 group-hover:scale-105 transition-transform`}>
              <PhoneCall size={12} />
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
