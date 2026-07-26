import { AlertOctagon, XCircle } from 'lucide-react'

export default function MistakesCard({ mistakesToAvoid = [] }) {
  if (!mistakesToAvoid || mistakesToAvoid.length === 0) return null

  return (
    <div className="rounded-2xl bg-slate-900 border border-red-500/20 p-6 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
          <AlertOctagon size={18} /> Common Legal Mistakes to Avoid
        </h3>
        <span className="text-xs text-slate-400 font-medium">Critical Pitfalls</span>
      </div>

      <div className="space-y-3">
        {mistakesToAvoid.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl bg-slate-950/80 border border-red-500/20 p-4 space-y-1 hover:border-red-500/40 transition-all"
          >
            <h4 className="text-xs font-bold text-red-300 flex items-center gap-2">
              <XCircle size={14} className="text-red-400 shrink-0" /> {item.mistake}
            </h4>
            <p className="text-[11px] text-slate-300 pl-5 leading-relaxed">
              <strong className="text-slate-400">Consequence:</strong> {item.consequence}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
