import { motion } from 'framer-motion'
import { Loader2, ShieldCheck } from 'lucide-react'

export default function UploadProgress({ progress, fileName }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5 space-y-3"
    >
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <Loader2 size={16} className="animate-spin text-indigo-600" />
          <span>Uploading "{fileName}"…</span>
        </div>
        <span className="font-mono font-bold text-indigo-600">{progress}%</span>
      </div>

      {/* Progress Track */}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-indigo-200/60">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-full transition-all duration-200"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
        <span>Encrypting legal document…</span>
        <span className="flex items-center gap-1 text-emerald-600 font-medium">
          <ShieldCheck size={12} /> 256-bit SSL Secure
        </span>
      </div>
    </motion.div>
  )
}
