import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Upload as UploadIcon,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Eye,
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import SectionCard from '../../components/common/SectionCard'
import toast from 'react-hot-toast'

export default function Upload() {
  const [selectedType, setSelectedType] = useState('Rent Agreement')
  const [file, setFile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [report, setReport] = useState(null)

  const handleSimulatedUpload = (fileName) => {
    setFile(fileName)
    setAnalyzing(true)
    setReport(null)

    setTimeout(() => {
      setAnalyzing(false)
      setReport({
        title: `${selectedType} — AI Summary & Risk Audit`,
        riskScore: 'Low-Medium Risk',
        summary:
          'This agreement is standard under the Model Tenancy Act, but contains a strict 11-month lock-in period and a 10% annual rent escalation clause.',
        clauses: [
          { name: 'Rent Escalation Clause', text: '10% increase after 11 months', status: 'Standard' },
          { name: 'Security Deposit Refund', text: 'Refund within 30 days of vacating', status: 'Safe' },
          { name: 'Lock-in Period', text: 'Neither party can terminate before 6 months', status: 'Warning ⚠️' },
          { name: 'Maintenance Dues', text: 'Tenant responsible for internal minor repairs under ₹1,000', status: 'Standard' },
        ],
        actionItem: 'Ask the landlord to add a 30-day notice period clause during the lock-in period in case of job transfer.',
      })
      toast.success('AI Legal Analysis Completed!')
    }, 2000)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="AI Legal Document Simplifier & Risk Analyzer"
        subtitle="Upload any Indian agreement, legal notice, or contract to generate instant plain-language breakdown."
      />

      {/* Document Type Selection */}
      <SectionCard title="Select Document Category">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {['Rent Agreement', 'Legal Notice', 'Sale Deed', 'Employment Contract', 'FIR Copy', 'Commercial Lease'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`rounded-xl border px-3 py-3 text-xs font-semibold transition-all ${
                selectedType === type
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs'
                  : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </SectionCard>

      {/* Upload Drop Zone */}
      <SectionCard>
        <div
          onClick={() => handleSimulatedUpload(`${selectedType}_Document_Scan.pdf`)}
          className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/30 p-10 text-center cursor-pointer hover:bg-indigo-50/60 hover:border-indigo-400 transition-all"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white mb-4 shadow-md shadow-indigo-500/20">
            <UploadIcon size={26} />
          </div>
          <p className="text-sm font-bold text-slate-800">
            Drag & drop your {selectedType} here
          </p>
          <p className="mt-1 text-xs text-slate-500">
            or click to select a sample file for instant AI analysis
          </p>
          <div className="mt-4 flex items-center gap-2 text-[11px] text-indigo-700 font-semibold bg-white border border-indigo-100 px-3.5 py-1.5 rounded-full shadow-xs">
            <Sparkles size={13} />
            <span>Try Instant Demo Analysis</span>
          </div>
        </div>
      </SectionCard>

      {/* Analysis Progress */}
      {analyzing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-indigo-200 bg-indigo-50/80 p-6 text-center space-y-3"
        >
          <RefreshCw size={24} className="animate-spin text-indigo-600 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800">Analyzing "{file}" using LawAssist AI Engine…</h4>
          <p className="text-xs text-slate-500">Extracting clauses, checking risk levels, and generating plain Hindi/English summary.</p>
        </motion.div>
      )}

      {/* Generated Report Card */}
      {report && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5 shadow-lg"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">AI Audit Complete</span>
              <h3 className="text-lg font-bold text-slate-900">{report.title}</h3>
            </div>
            <span className="rounded-full bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 text-xs font-bold">
              {report.riskScore}
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Plain Language Summary</h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80 font-medium">
              {report.summary}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Extracted Clauses & Risk Status</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {report.clauses.map((c, i) => (
                <div key={i} className="rounded-xl border border-slate-200 p-3 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{c.name}</span>
                    <span className="text-[10px] font-semibold text-slate-600">{c.status}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{c.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-4 flex items-start gap-3">
            <Sparkles size={18} className="text-indigo-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-indigo-950">Recommended Next Step:</p>
              <p className="text-xs text-indigo-900 mt-0.5">{report.actionItem}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
