import { Building2, Landmark, Clock, ArrowRight } from 'lucide-react'

export default function ContactAuthoritiesCard({ contactAuthorities = [] }) {
  if (!contactAuthorities || contactAuthorities.length === 0) return null

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400 flex items-center gap-2">
          <Landmark size={18} /> Government Authority / Office to Contact
        </h3>
        <span className="text-xs text-slate-400 font-medium">Jurisdiction Office</span>
      </div>

      <div className="space-y-3">
        {contactAuthorities.map((auth, idx) => (
          <div
            key={idx}
            className="rounded-xl bg-slate-950/80 border border-indigo-500/20 p-4 space-y-2 hover:border-indigo-500/40 transition-all"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                  <Building2 size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white">{auth.name}</h4>
                  <span className="text-[10px] text-indigo-300 flex items-center gap-1">
                    <Clock size={11} /> {auth.whenToContact || 'Within 7 Days'}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              <strong className="text-white">Reason:</strong> {auth.reason}
            </p>
            {auth.purpose && (
              <p className="text-[10px] text-slate-400">
                <strong className="text-slate-300">Purpose:</strong> {auth.purpose}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
