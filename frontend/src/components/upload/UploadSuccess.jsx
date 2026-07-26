import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, FileText, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function UploadSuccess({ document }) {
  const navigate = useNavigate()

  const docId = document._id || document.id || 'demo_doc_id'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 sm:p-8 text-center space-y-5"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30">
        <CheckCircle2 size={32} />
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-bold text-slate-900">
          Document Uploaded Successfully!
        </h3>
        <p className="text-xs text-slate-600">
          Your document has been securely stored and registered.
        </p>
      </div>

      {/* Document Details Summary */}
      <div className="mx-auto max-w-md rounded-2xl border border-emerald-200/80 bg-white p-4 text-left space-y-2 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <FileText size={15} className="text-emerald-600" />
          <span className="truncate">{document.title || document.originalFileName}</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <Clock size={12} /> Just now
          </span>
          <span className="rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 font-bold text-[10px]">
            Waiting for AI Analysis
          </span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => navigate(`/document/${docId}`)}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-7 py-3 text-xs sm:text-sm shadow-lg shadow-emerald-600/20 hover:scale-[1.02] transition-all"
      >
        <span>View Document Details</span>
        <ArrowRight size={16} />
      </button>
    </motion.div>
  )
}
