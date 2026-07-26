import { Lightbulb, CheckCircle2 } from 'lucide-react'

export default function SuggestionsCard({ helpfulSuggestions = [] }) {
  if (!helpfulSuggestions || helpfulSuggestions.length === 0) return null

  return (
    <div className="rounded-2xl bg-slate-900 border border-emerald-500/20 p-6 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <Lightbulb size={18} /> Helpful Legal Recommendations & Tips
        </h3>
        <span className="text-xs text-slate-400 font-medium">Best Practices</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {helpfulSuggestions.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl bg-slate-950/80 border border-emerald-500/10 p-3.5 flex items-start gap-2.5 hover:border-emerald-500/30 transition-all"
          >
            <CheckCircle2 size={15} className="mt-0.5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs text-slate-200 leading-relaxed">{item.tip}</p>
              {item.category && (
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-800 text-slate-400">
                  {item.category}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
