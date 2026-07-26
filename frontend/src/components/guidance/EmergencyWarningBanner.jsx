import { AlertTriangle, ShieldAlert } from 'lucide-react'

export default function EmergencyWarningBanner({ emergencyWarning }) {
  if (!emergencyWarning || !emergencyWarning.detected) return null

  return (
    <div className="rounded-2xl bg-gradient-to-r from-red-950 via-red-900 to-amber-950 border-2 border-red-500 p-5 text-white shadow-2xl space-y-2 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/20 text-red-400 border border-red-500/40">
          <ShieldAlert size={22} />
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-red-200 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle size={16} /> Urgent Legal Matter Alert
          </h3>
          <p className="text-xs text-red-100/90 leading-relaxed font-medium">
            {emergencyWarning.warningMessage || 'This legal document involves severe statutory risks or strict limitation response windows. Immediate professional legal action is advised.'}
          </p>
        </div>
      </div>
    </div>
  )
}
