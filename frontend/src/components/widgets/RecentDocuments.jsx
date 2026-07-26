import { motion } from 'framer-motion'
import { Eye, FileText, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { mockDocuments } from '../../data/mockData'

const statusConfig = {
  'Analysed':       { label: 'Analysed',       cls: 'badge badge-green'  },
  'Pending Review': { label: 'Pending Review', cls: 'badge badge-yellow' },
  'Flagged':        { label: 'Flagged',         cls: 'badge badge-red'   },
}

const typeColors = {
  Contract:  'badge badge-blue',
  Notice:    'badge badge-yellow',
  Agreement: 'badge badge-purple',
  Deed:      'badge badge-blue',
  FIR:       'badge badge-red',
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export default function RecentDocuments({ limit = 5 }) {
  const navigate = useNavigate()
  const docs = mockDocuments.slice(0, limit)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border-light)]">
            {['Document Name', 'Type', 'Status', 'Uploaded On', 'Action'].map((h) => (
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
          {docs.map((doc, i) => {
            const status = statusConfig[doc.status] ?? statusConfig['Pending Review']
            const typeCls = typeColors[doc.type] ?? 'badge badge-blue'
            return (
              <motion.tr
                key={doc.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="group border-b border-[var(--color-border-light)] last:border-0 hover:bg-[var(--color-surface-alt)] transition-colors cursor-pointer"
                onClick={() => navigate(`/dashboard/analysis/${doc.id}`)}
              >
                {/* Name */}
                <td className="px-4 py-3.5 max-w-[220px]">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-50)]">
                      <FileText size={14} className="text-[var(--color-primary)]" />
                    </div>
                    <span className="truncate font-medium text-[var(--color-text)]">{doc.name}</span>
                  </div>
                </td>

                {/* Type */}
                <td className="px-4 py-3.5">
                  <span className={typeCls}>{doc.type}</span>
                </td>

                {/* Status */}
                <td className="px-4 py-3.5">
                  <span className={status.cls}>{status.label}</span>
                </td>

                {/* Uploaded On */}
                <td className="px-4 py-3.5 text-[var(--color-text-secondary)] whitespace-nowrap">
                  {formatDate(doc.uploadedOn)}
                </td>

                {/* Action */}
                <td className="px-4 py-3.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/dashboard/analysis/${doc.id}`)
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
