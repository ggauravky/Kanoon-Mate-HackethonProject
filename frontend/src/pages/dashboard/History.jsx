import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Clock, FileText, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import SectionCard from '../../components/common/SectionCard'
import { documentsAPI } from '../../services/api'

function formatDate(dateStr) {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export default function History() {
  const [historyItems, setHistoryItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true)
        const res = await documentsAPI.getDocuments()
        const docs = res.data?.data?.documents || res.data?.documents || []
        // Filter documents that have completed OCR or AI analysis
        const analyzedDocs = docs.filter(
          (doc) => doc.analysisStatus === 'AI Completed' || doc.ocrStatus === 'OCR Completed' || doc.analysis?.summary
        )
        setHistoryItems(analyzedDocs.length > 0 ? analyzedDocs : docs)
      } catch (err) {
        console.error('Failed to fetch history:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="History"
        subtitle="Review your past AI legal analyses and document interactions."
      />

      <SectionCard title="AI Document Analysis History">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-16 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
            ))}
          </div>
        ) : historyItems.length === 0 ? (
          <div className="py-12 text-center text-slate-500 dark:text-slate-400">
            <FileText size={36} className="mx-auto mb-3 text-slate-400 opacity-60" />
            <p className="text-base font-semibold">No analysis history found</p>
            <p className="text-xs mt-1">Upload legal documents to generate AI analyses and compliance reports.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {historyItems.map((doc, i) => (
              <motion.div
                key={doc._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Link
                  to={`/dashboard/documents/${doc._id}`}
                  className="flex items-start gap-3 rounded-xl border border-[var(--color-border-light)] p-4 hover:bg-[var(--color-surface-alt)] transition-colors cursor-pointer group block"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40">
                    <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-[var(--color-text)] truncate">{doc.title}</p>
                      <span className="text-xs text-[var(--color-text-muted)] shrink-0 flex items-center gap-1">
                        <Clock size={11} />
                        {formatDate(doc.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[var(--color-text-muted)] truncate">
                      {doc.analysis?.summary || doc.ocrText?.slice(0, 100) || doc.originalFileName || 'Legal Document Analysis'}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                        {doc.analysisStatus || 'Analyzed'}
                      </span>
                      {doc.analysis?.riskLevel && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                          Risk: {doc.analysis.riskLevel}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  )
}
