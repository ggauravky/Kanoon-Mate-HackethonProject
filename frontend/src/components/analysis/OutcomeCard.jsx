import { HelpCircle, Sparkles, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react'

export default function OutcomeCard({ likelyOutcomes }) {
  if (!likelyOutcomes) return null

  const { bestCase, likelyCase, worstCase } = likelyOutcomes

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400 flex items-center gap-2">
          <TrendingUp size={18} /> Likely Legal Outcomes & Scenario Analysis
        </h3>
        <span className="text-[10px] text-slate-400 font-semibold">Informational Prediction</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Best Case */}
        <div className="rounded-xl bg-slate-950/80 border border-emerald-500/30 p-4 space-y-1.5">
          <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck size={12} /> Best-Case Scenario
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">{bestCase || 'Amicable out-of-court settlement.'}</p>
        </div>

        {/* Likely Case */}
        <div className="rounded-xl bg-slate-950/80 border border-indigo-500/30 p-4 space-y-1.5">
          <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles size={12} /> Most Likely Outcome
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">{likelyCase || 'Formal negotiation through legal notice compliance.'}</p>
        </div>

        {/* Worst Case */}
        <div className="rounded-xl bg-slate-950/80 border border-red-500/30 p-4 space-y-1.5">
          <span className="text-[10px] font-extrabold text-red-400 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle size={12} /> Worst-Case Risk
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">{worstCase || 'Litigation proceedings if obligations are contested.'}</p>
        </div>
      </div>

      <p className="text-[10px] text-slate-400 italic text-center pt-1">
        * Note: Case outcome predictions are AI-generated informational assessments based on document text and do not guarantee judicial results.
      </p>
    </div>
  )
}
