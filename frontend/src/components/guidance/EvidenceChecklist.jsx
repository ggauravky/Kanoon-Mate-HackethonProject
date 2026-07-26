import { ShieldCheck, Database, Camera, FileText } from 'lucide-react'

export default function EvidenceChecklist({ evidenceChecklist = [] }) {
  if (!evidenceChecklist || evidenceChecklist.length === 0) return null

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-emerald-400 flex items-center gap-2">
          <ShieldCheck size={18} /> Evidence Preservation Checklist
        </h3>
        <span className="text-xs text-slate-400 font-medium">
          Preserve Immediately
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {evidenceChecklist.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl bg-slate-950/80 border border-emerald-500/20 p-4 space-y-2 hover:border-emerald-500/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Database size={13} className="text-emerald-400" /> {item.name}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/10 text-emerald-400">
                {item.type || 'Digital'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {item.instructions}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
