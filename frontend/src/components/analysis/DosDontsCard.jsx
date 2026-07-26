import { CheckCircle2, XCircle, ShieldAlert } from 'lucide-react'

export default function DosDontsCard({ dos = [], donts = [] }) {
  if ((!dos || dos.length === 0) && (!donts || donts.length === 0)) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* DO's */}
      <div className="rounded-2xl bg-slate-900 border border-emerald-500/20 p-5 space-y-3 shadow-xl">
        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 size={16} /> Legal Do's (Recommended Actions)
        </h3>
        <ul className="space-y-2">
          {dos.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
              <CheckCircle2 size={14} className="mt-0.5 text-emerald-400 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* DONT's */}
      <div className="rounded-2xl bg-slate-900 border border-red-500/20 p-5 space-y-3 shadow-xl">
        <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
          <XCircle size={16} /> Legal Don'ts (Critical Pitfalls to Avoid)
        </h3>
        <ul className="space-y-2">
          {donts.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
              <XCircle size={14} className="mt-0.5 text-red-400 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
