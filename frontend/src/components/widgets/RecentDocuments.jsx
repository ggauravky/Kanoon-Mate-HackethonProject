import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { documentsAPI } from '../../services/api'

const statusConfig = {
  'AI Completed': { label: 'AI Analyzed', cls: 'badge badge-green' },
  'OCR Complete': { label: 'OCR Complete', cls: 'badge badge-blue' },
  'Processing OCR': { label: 'Processing OCR', cls: 'badge badge-yellow' },
  'AI Processing': { label: 'Analyzing...', cls: 'badge badge-purple' },
  'Failed': { label: 'Failed', cls: 'badge badge-red' },
  'Uploaded': { label: 'Uploaded', cls: 'badge badge-gray' },
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function RecentDocuments({ limit = 5 }) {
  const navigate = useNavigate()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    documentsAPI
      .getDocuments()
      .then((res) => {
        if (isMounted && res.data?.data?.documents) {
          setDocuments(res.data.data.documents.slice(0, limit))
        }
      })
      .catch(() => {
        if (isMounted) setDocuments([])
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [limit])

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 font-medium">
        Loading recent documents...
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="p-8 text-center space-y-2">
        <FileText size={32} className="mx-auto text-slate-300" />
        <p className="text-xs font-semibold text-slate-700">No documents uploaded yet</p>
        <p className="text-[11px] text-slate-500">Upload your legal contracts or agreements to simplify them.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border-light)]">
            {['Document Name', 'Format', 'Status', 'Uploaded On', 'Action'].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {documents.map((doc, i) => {
            const currentStatus = doc.analysisStatus || doc.ocrStatus || doc.uploadStatus || 'Uploaded'
            const status = statusConfig[currentStatus] ?? statusConfig['Uploaded']

            return (
              <motion.tr
                key={doc._id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="group border-b border-[var(--color-border-light)] last:border-0 hover:bg-[var(--color-surface-alt)] transition-colors cursor-pointer"
                onClick={() => navigate(`/dashboard/analysis/${doc._id}`)}
              >
                {/* Name */}
                <td className="px-4 py-3.5 max-w-[220px]">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-50)]">
                      <FileText size={14} className="text-[var(--color-primary)]" />
                    </div>
                    <span className="truncate font-medium text-[var(--color-text)]">
                      {doc.title || doc.originalFileName}
                    </span>
                  </div>
                </td>

                {/* Format */}
                <td className="px-4 py-3.5">
                  <span className="badge badge-blue uppercase">
                    {doc.mimeType?.split('/')[1] || 'PDF'}
                  </span>
                </td>

                {/* Status */}
                <td className="px-4 py-3.5">
                  <span className={status.cls}>{status.label}</span>
                </td>

                {/* Uploaded On */}
                <td className="px-4 py-3.5 text-[var(--color-text-secondary)] whitespace-nowrap">
                  {formatDate(doc.createdAt)}
                </td>

                {/* Action */}
                <td className="px-4 py-3.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/dashboard/analysis/${doc._id}`)
                    }}
                    className="btn-primary py-1.5 px-2.5 text-xs gap-1.5 opacity-90 group-hover:opacity-100"
                  >
                    <Sparkles size={13} />
                    Analyse
                  </button>
                </td>
              </motion.tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
