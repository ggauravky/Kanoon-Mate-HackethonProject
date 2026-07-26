import { useState } from 'react'
import { ListOrdered, ChevronDown, ChevronUp, Clock, AlertCircle } from 'lucide-react'

export default function ActionPlanTimeline({ actionPlan = [] }) {
  const [expandedIndex, setExpandedIndex] = useState(0)

  if (!actionPlan || actionPlan.length === 0) return null

  const getPriorityBadge = (priority) => {
    const p = (priority || 'medium').toLowerCase()
    if (p === 'high') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
          High Priority
        </span>
      )
    }
    if (p === 'low') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
          Low Priority
        </span>
      )
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
        Medium Priority
      </span>
    )
  }

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400 flex items-center gap-2">
          <ListOrdered size={18} /> What Should You Do Next?
        </h3>
        <span className="text-xs text-slate-400 font-medium">
          Step-by-Step Legal Roadmap
        </span>
      </div>

      <div className="space-y-3">
        {actionPlan.map((item, idx) => {
          const isExpanded = expandedIndex === idx
          return (
            <div
              key={idx}
              className={`rounded-xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'bg-slate-950 border-indigo-500/40 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 font-extrabold text-xs border border-indigo-500/30">
                    {item.step || idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      {item.title}
                    </h4>
                    {item.estimatedTime && (
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock size={11} className="text-indigo-400" /> {item.estimatedTime}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getPriorityBadge(item.priority)}
                  {isExpanded ? (
                    <ChevronUp size={16} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={16} className="text-slate-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-900/80 space-y-2">
                  <p>{item.description}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>Target Timeframe: <strong className="text-white">{item.estimatedTime || 'Immediate'}</strong></span>
                    <span>Requirement: <strong className={item.isMandatory ? 'text-red-400' : 'text-blue-400'}>{item.isMandatory ? 'Mandatory' : 'Optional'}</strong></span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
