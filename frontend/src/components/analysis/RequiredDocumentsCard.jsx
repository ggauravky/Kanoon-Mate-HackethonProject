import { FileCheck2, ShieldCheck, AlertCircle } from 'lucide-react'

export default function RequiredDocumentsCard({ requiredDocuments = [] }) {
  if (!requiredDocuments || requiredDocuments.length === 0) return null

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400 flex items-center gap-2">
          <FileCheck2 size={18} /> Required Supporting Documents
        </h3>
        <span className="text-xs text-slate-400 font-medium">
          Prepare Next
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {requiredDocuments.map((doc, idx) => (
          <div
            key={idx}
            className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 space-y-2 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                  <FileCheck2 size={15} />
                </div>
                <h4 className="text-xs font-bold text-white">{doc.name}</h4>
              </div>

              {doc.mandatory ? (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-red-500/10 text-red-400 border border-red-500/20 shrink-0">
                  Mandatory
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-slate-800 text-slate-400 shrink-0">
                  Optional
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              {doc.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
