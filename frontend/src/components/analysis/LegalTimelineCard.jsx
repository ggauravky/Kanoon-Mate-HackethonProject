import { Clock, Calendar, AlertTriangle } from 'lucide-react'

export default function LegalTimelineCard({ timeline = [] }) {
  if (!timeline || timeline.length === 0) return null

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-amber-400 flex items-center gap-2">
          <Clock size={18} /> Statutory Legal Timeline & Deadlines
        </h3>
        <span className="text-xs text-slate-400 font-medium">
          Limitation Milestones
        </span>
      </div>

      <div className="relative border-l-2 border-slate-800 ml-3 pl-5 space-y-4 my-2">
        {timeline.map((item, idx) => (
          <div key={idx} className="relative">
            <div className="absolute -left-[27px] top-1.5 h-3.5 w-3.5 rounded-full bg-amber-500 border-2 border-slate-900 shadow-sm" />
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3.5 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-white">{item.title}</h4>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  <Calendar size={11} /> {item.deadline}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
