import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Clock,
  CheckCircle2,
  Trash2,
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Copy,
  Download,
  Check,
  Loader2,
  RefreshCw,
  Eye,
  Cpu,
  AlignLeft,
} from 'lucide-react'
import { documentsAPI } from '../../services/api'
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

export default function DocumentDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [doc, setDoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [copied, setCopied] = useState(false)

  const BASE_URL = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '')
    : 'http://localhost:5000'

  const fetchDocument = async () => {
    try {
      const res = await documentsAPI.getDocumentById(id)
      if (res.data?.data?.document) {
        setDoc(res.data.data.document)
      }
    } catch (err) {
      toast.error('Failed to load document details.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocument()
  }, [id])

  const handleExtractText = async () => {
    setExtracting(true)
    // Update local state to show 'Processing OCR' immediately
    setDoc((prev) => (prev ? { ...prev, ocrStatus: 'Processing OCR' } : prev))

    try {
      const res = await documentsAPI.extractText(id)
      const data = res.data?.data
      toast.success('Text extracted successfully!')
      if (data) {
        setDoc((prev) => ({
          ...prev,
          ocrStatus: data.ocrStatus || 'OCR Completed',
          ocrText: data.ocrText || '',
          processingTime: data.processingTime || 0,
          ocrCompletedAt: data.ocrCompletedAt || new Date().toISOString(),
        }))
      } else {
        await fetchDocument()
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to extract text from document'
      toast.error(errorMsg)
      setDoc((prev) => (prev ? { ...prev, ocrStatus: 'OCR Failed' } : prev))
    } finally {
      setExtracting(false)
    }
  }

  const handleCopyText = () => {
    if (!doc?.ocrText) return
    navigator.clipboard.writeText(doc.ocrText)
    setCopied(true)
    toast.success('Extracted text copied to clipboard!')
    setTimeout(() => setCopied(false), 2500)
  }

  const handleDownloadTxt = () => {
    if (!doc?.ocrText) return
    const element = document.createElement('a')
    const file = new Blob([doc.ocrText], { type: 'text/plain;charset=utf-8' })
    element.href = URL.createObjectURL(file)
    element.download = `${doc.title || 'document'}_ocr_text.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success('Downloaded extracted text (.txt) file')
  }

  const handleDelete = async () => {
    if (
      !window.confirm(
        'Are you sure you want to delete this document? This action cannot be undone.'
      )
    ) {
      return
    }

    setDeleting(true)
    try {
      await documentsAPI.deleteDocument(id)
      toast.success('Document deleted successfully.')
      navigate('/dashboard/documents')
    } catch (err) {
      toast.error(err.message || 'Failed to delete document')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-xs text-slate-500 font-medium">Loading document...</p>
        </div>
      </div>
    )
  }

  if (!doc) {
    return (
      <div className="text-center py-12 space-y-4 max-w-md mx-auto">
        <AlertCircle size={40} className="mx-auto text-red-500" />
        <h3 className="text-lg font-bold text-slate-900">Document Not Found</h3>
        <p className="text-xs text-slate-500">
          The requested document could not be located or you do not have permission to view it.
        </p>
        <Link to="/dashboard/documents" className="inline-flex items-center gap-2 btn-primary text-xs">
          <ArrowLeft size={14} /> Back to Documents
        </Link>
      </div>
    )
  }

  const isImage = doc.mimeType?.startsWith('image/')
  const isPdf = doc.mimeType === 'application/pdf'
  const targetPath = doc.fileUrl || doc.filePath
  const fileUrl = targetPath ? (targetPath.startsWith('http') ? targetPath : `${BASE_URL}/${targetPath}`) : null

  const wordCount = doc.ocrText ? (doc.ocrText.match(/\S+/g) || []).length : 0
  const charCount = doc.ocrText ? doc.ocrText.length : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-5xl mx-auto pb-12"
    >
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard/documents')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Documents Vault
        </button>

        {/* Delete Document Button */}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50"
        >
          <Trash2 size={14} />
          <span>Delete Document</span>
        </button>
      </div>

      <PageHeader
        title={doc.title || doc.originalFileName}
        subtitle="OCR Text Extraction & Document Viewer"
      />

      {/* Main Grid: Preview & OCR Control Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: File Specs & Preview */}
        <div className="space-y-5 lg:col-span-1">
          {/* Document File Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <FileText size={15} className="text-indigo-600" /> File Information
            </h3>

            <div className="space-y-3 text-xs divide-y divide-slate-100">
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Filename</span>
                <span className="font-semibold text-slate-900 truncate max-w-[140px]" title={doc.originalFileName}>
                  {doc.originalFileName}
                </span>
              </div>
              <div className="pt-2.5 flex justify-between">
                <span className="text-slate-500">Size</span>
                <span className="font-semibold text-slate-900">{formatBytes(doc.fileSize)}</span>
              </div>
              <div className="pt-2.5 flex justify-between">
                <span className="text-slate-500">Format</span>
                <span className="font-semibold text-slate-900 uppercase">
                  {doc.mimeType?.split('/')[1] || 'PDF'}
                </span>
              </div>
              <div className="pt-2.5 flex justify-between">
                <span className="text-slate-500">Uploaded</span>
                <span className="font-semibold text-slate-900">
                  {new Date(doc.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Document Preview Box */}
            {fileUrl && (
              <div className="pt-3 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Eye size={13} /> Preview
                </p>
                <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center min-h-[160px] max-h-[220px]">
                  {isImage ? (
                    <img
                      src={fileUrl}
                      alt={doc.title}
                      className="object-contain w-full h-full max-h-[200px]"
                    />
                  ) : isPdf ? (
                    <div className="text-center p-4 space-y-2">
                      <FileText size={36} className="mx-auto text-indigo-500 opacity-80" />
                      <p className="text-[11px] font-semibold text-slate-600">PDF Legal Document</p>
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:underline"
                      >
                        Open PDF File ↗
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          {/* Privacy Security Badge */}
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
              <ShieldCheck size={16} /> 256-Bit Encrypted Storage
            </div>
            <p className="text-[11px] text-emerald-700 leading-relaxed">
              Extracted text is processed securely. Only your authenticated user account can access this data.
            </p>
          </div>
        </div>

        {/* Right 2 Cols: OCR Pipeline Control & Results */}
        <div className="space-y-5 lg:col-span-2">
          {/* OCR Status & Trigger Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Cpu className="text-indigo-600" size={18} />
                  <h3 className="text-sm font-bold text-slate-900">OCR & Text Extraction Pipeline</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Extract readable legal text from PDF documents and images using pdf-parse & Tesseract OCR.
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={handleExtractText}
                disabled={extracting || doc.ocrStatus === 'Processing OCR'}
                className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 text-xs font-bold shadow-sm transition-all disabled:opacity-60 cursor-pointer"
              >
                {extracting || doc.ocrStatus === 'Processing OCR' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Processing OCR...</span>
                  </>
                ) : doc.ocrStatus === 'OCR Completed' ? (
                  <>
                    <RefreshCw size={14} />
                    <span>Re-Run OCR</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Extract Text</span>
                  </>
                )}
              </button>
            </div>

            {/* Dynamic Status Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Pipeline Status:</span>
                {doc.ocrStatus === 'OCR Completed' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold border border-emerald-200">
                    <CheckCircle2 size={13} /> OCR Completed
                  </span>
                )}
                {doc.ocrStatus === 'Processing OCR' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 text-indigo-800 px-3 py-1 text-xs font-bold border border-indigo-200">
                    <Loader2 size={13} className="animate-spin" /> Extracting Text...
                  </span>
                )}
                {doc.ocrStatus === 'OCR Failed' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 text-red-800 px-3 py-1 text-xs font-bold border border-red-200">
                    <AlertCircle size={13} /> OCR Failed
                  </span>
                )}
                {(!doc.ocrStatus || doc.ocrStatus === 'Uploaded') && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-xs font-bold border border-amber-200">
                    <Clock size={13} /> Ready for Extraction
                  </span>
                )}
              </div>

              {doc.processingTime > 0 && (
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                  <Clock size={12} /> Processed in {(doc.processingTime / 1000).toFixed(2)}s
                </span>
              )}
            </div>

            {/* Loading Progress Bar Animation */}
            <AnimatePresence>
              {(extracting || doc.ocrStatus === 'Processing OCR') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-2 space-y-2 overflow-hidden"
                >
                  <div className="h-1.5 w-full bg-indigo-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-indigo-600 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '90%' }}
                      transition={{ duration: 3, ease: 'easeInOut' }}
                    />
                  </div>
                  <p className="text-[11px] text-center text-indigo-600 font-medium animate-pulse">
                    Running OCR text extraction engine... Please wait a moment.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* OCR Result UI Section */}
          {doc.ocrStatus === 'OCR Completed' && doc.ocrText ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl border border-slate-200 bg-white p-6 space-y-5 shadow-xs"
            >
              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 text-center">
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Total Words
                  </span>
                  <span className="text-lg font-bold text-slate-900">{wordCount.toLocaleString()}</span>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 text-center">
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Total Characters
                  </span>
                  <span className="text-lg font-bold text-slate-900">{charCount.toLocaleString()}</span>
                </div>
                <div className="col-span-2 sm:col-span-1 rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 text-center">
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Extraction Time
                  </span>
                  <span className="text-lg font-bold text-indigo-600">
                    {doc.processingTime ? `${(doc.processingTime / 1000).toFixed(2)}s` : '< 1s'}
                  </span>
                </div>
              </div>

              {/* Extracted Text Box Header & Controls */}
              <div className="flex items-center justify-between pt-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <AlignLeft size={16} className="text-indigo-600" /> Extracted Document Text
                </h4>

                <div className="flex items-center gap-2">
                  {/* Copy Button */}
                  <button
                    onClick={handleCopyText}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                  </button>

                  {/* Download TXT Button */}
                  <button
                    onClick={handleDownloadTxt}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Download .TXT</span>
                  </button>
                </div>
              </div>

              {/* Scrollable Cleaned Text Display Area */}
              <div className="relative">
                <textarea
                  readOnly
                  value={doc.ocrText}
                  rows={14}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-900 text-slate-100 p-4 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y"
                  placeholder="No extracted text available."
                />
              </div>
            </motion.div>
          ) : doc.ocrStatus === 'Uploaded' || !doc.ocrStatus ? (
            /* Prompt to Run OCR */
            <div className="rounded-3xl border border-dashed border-indigo-200 bg-indigo-50/40 p-8 text-center space-y-3">
              <Sparkles size={32} className="mx-auto text-indigo-500" />
              <h4 className="text-sm font-bold text-slate-900">Ready for Text Extraction</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Click the "Extract Text" button above to run the OCR engine on this document.
                The extracted text will be cleaned and formatted for AI legal analysis.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  )
}
