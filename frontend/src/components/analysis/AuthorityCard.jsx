import { Building2, Landmark, ArrowRight } from 'lucide-react'

export default function AuthorityCard({ authority }) {
  if (!authority) return null

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-500/20 p-5 space-y-2 shadow-xl">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
          <Landmark size={16} /> Recommended Next Authority to Approach
        </span>
        <span className="text-[10px] text-slate-400 font-semibold">Jurisdiction Guide</span>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
          <Building2 size={20} />
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-white">{authority}</h4>
          <p className="text-xs text-slate-300">
            Submit formal applications, written replies, or notices under relevant statutory provisions.
          </p>
        </div>
      </div>
    </div>
  )
}
