import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileCheck2,
  Search,
  Download,
  Printer,
  Share2,
  Trash2,
  Eye,
  Calendar,
  HardDrive,
  FileText,
  Loader2,
  AlertCircle,
  RefreshCw,
  X,
  ExternalLink,
  Check,
} from 'lucide-react'
import { reportsAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import toast from 'react-hot-toast'

function formatBytes(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export default function Reports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState('desc') // 'desc' | 'asc'
  const [selectedReport, setSelectedReport] = useState(null)
  const [viewingModal, setViewingModal] = useState(false)
  const [copiedId, setCopiedId] = useState(null)

  const BASE_URL = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '')
    : 'http://localhost:5000'

  const fetchReports = async () => {
    setLoading(true)
    try {
      const res = await reportsAPI.getReports({ search })
      if (res.data?.data?.reports) {
        setReports(res.data.data.reports)
      }
    } catch (err) {
      toast.error('Failed to load generated reports.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [search])

  const handleDelete = async (id, e) => {
    e?.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this report? The PDF file will be deleted permanently.')) {
      return
    }

    try {
      await reportsAPI.deleteReport(id)
      setReports((prev) => prev.filter((r) => r._id !== id))
      toast.success('Report deleted successfully.')
      if (selectedReport?._id === id) {
        setViewingModal(false)
        setSelectedReport(null)
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete report')
    }
  }

  const getReportUrl = (report) => {
    const target = report?.fileUrl || report?.filePath || ''
    return target.startsWith('http') ? target : `${BASE_URL}/${target}`
  }

  const handleDownload = (report, e) => {
    e?.stopPropagation()
    const downloadUrl = getReportUrl(report)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.target = '_blank'
    link.download = report.reportName || 'Kanoon-Mate_Legal_Report.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Downloading PDF report...')
  }

  const handlePrint = (report, e) => {
    e?.stopPropagation()
    const fileUrl = getReportUrl(report)
    const printWindow = window.open(fileUrl, '_blank')
    if (printWindow) {
      printWindow.focus()
      toast.success('Opening print dialog...')
    } else {
      toast.error('Pop-up blocked. Please allow pop-ups to print reports.')
    }
  }

  const handleShare = (report, e) => {
    e?.stopPropagation()
    const fileUrl = getReportUrl(report)
    navigator.clipboard.writeText(fileUrl)
    setCopiedId(report._id)
    toast.success('Report link copied to clipboard!')
    setTimeout(() => setCopiedId(null), 2500)
  }

  const handleViewModal = (report) => {
    setSelectedReport(report)
    setViewingModal(true)
  }

  // Filter & Sorting
  const filteredReports = [...reports].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.generatedAt).getTime()
    const dateB = new Date(b.createdAt || b.generatedAt).getTime()
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-6xl mx-auto pb-12"
    >
      <PageHeader
        title="AI Legal Reports & Exports"
        subtitle="Manage, download, print, and share your generated AI legal analysis reports"
      />

      {/* Control Bar: Search & Sorting */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        {/* Sort Order Selector */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-slate-500 font-semibold">Sort by:</span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>

          <button
            onClick={fetchReports}
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
            title="Refresh list"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Reports Grid Section */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="animate-spin text-indigo-600" />
            <p className="text-xs font-medium text-slate-500">Loading reports history...</p>
          </div>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/60 p-12 text-center space-y-4">
          <FileCheck2 size={44} className="mx-auto text-slate-400" />
          <h3 className="text-base font-bold text-slate-900">No Reports Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't generated any legal PDF reports yet. Go to your document's AI Analysis page and click "Generate Report".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReports.map((report) => {
            const reportDate = new Date(report.createdAt || report.generatedAt).toLocaleDateString(
              'en-IN',
              { day: 'numeric', month: 'short', year: 'numeric' }
            )

            return (
              <motion.div
                key={report._id}
                layout
                whileHover={{ y: -3 }}
                onClick={() => handleViewModal(report)}
                className="group rounded-3xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer flex flex-col justify-between"
              >
                {/* Header Info */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <FileCheck2 size={22} />
                    </div>
                    <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      PDF Ready
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {report.reportName}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      Doc: {report.document?.title || 'Legal Document'}
                    </p>
                  </div>
                </div>

                {/* Details Meta */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {reportDate}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <HardDrive size={12} /> {formatBytes(report.fileSize)}
                  </span>
                </div>

                {/* Action Buttons Toolbar */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 gap-1">
                  <button
                    onClick={(e) => handleDownload(report, e)}
                    className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-1.5 text-xs font-semibold transition-colors"
                    title="Download PDF"
                  >
                    <Download size={13} /> Download
                  </button>

                  <button
                    onClick={(e) => handlePrint(report, e)}
                    className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
                    title="Print Report"
                  >
                    <Printer size={13} />
                  </button>

                  <button
                    onClick={(e) => handleShare(report, e)}
                    className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
                    title="Copy Share Link"
                  >
                    {copiedId === report._id ? <Check size={13} className="text-emerald-600" /> : <Share2 size={13} />}
                  </button>

                  <button
                    onClick={(e) => handleDelete(report._id, e)}
                    className="p-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                    title="Delete Report"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* PDF Report Viewer Modal */}
      <AnimatePresence>
        {viewingModal && selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <FileCheck2 className="text-indigo-600" size={20} />
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{selectedReport.reportName}</h3>
                    <p className="text-[11px] text-slate-500">Kanoon-Mate Legal Analysis Report</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDownload(selectedReport, e)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 text-xs font-bold transition-colors"
                  >
                    <Download size={13} /> Download PDF
                  </button>

                  <button
                    onClick={(e) => handlePrint(selectedReport, e)}
                    className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors"
                    title="Print"
                  >
                    <Printer size={15} />
                  </button>

                  <button
                    onClick={() => setViewingModal(false)}
                    className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Modal PDF Viewer Body */}
              <div className="flex-1 bg-slate-800 p-2 overflow-hidden">
                <iframe
                  src={getReportUrl(selectedReport)}
                  title={selectedReport.reportName}
                  className="w-full h-full rounded-2xl border-0"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
