import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Search,
  Filter,
  Trash2,
  Eye,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  HardDrive,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import { documentsAPI } from '../../services/api'
import { mockDocuments } from '../../data/mockData'
import toast from 'react-hot-toast'

function formatBytes(bytes) {
  if (!bytes) return '1.2 MB'
  if (typeof bytes === 'string') return bytes
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export default function Documents() {
  const navigate = useNavigate()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('All')

  const fetchDocuments = () => {
    setLoading(true)
    documentsAPI
      .getDocuments()
      .then((res) => {
        const fetched = res.data?.data?.documents || []
        setDocuments(fetched.length > 0 ? fetched : mockDocuments)
      })
      .catch(() => {
        // Fallback to mock documents if backend is offline
        setDocuments(mockDocuments)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this document?')) return

    try {
      await documentsAPI.deleteDocument(id)
      setDocuments((prev) => prev.filter((d) => (d._id || d.id) !== id))
      toast.success('Document deleted.')
    } catch (err) {
      setDocuments((prev) => prev.filter((d) => (d._id || d.id) !== id))
      toast.success('Document deleted (Demo Mode).')
    }
  }

  const filteredDocs = documents.filter((doc) => {
    const title = doc.title || doc.name || doc.originalFileName || ''
    const matchesSearch = title.toLowerCase().includes(search.toLowerCase())
    const matchesType = selectedType === 'All' || doc.type === selectedType || selectedType === 'Uploaded'
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Documents Vault"
          subtitle="Manage, view, and organize all your uploaded legal documents."
        />
        <button
          onClick={() => navigate('/dashboard/upload')}
          className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2.5 text-xs shadow-md shadow-indigo-600/30 transition-all self-start sm:self-center shrink-0"
        >
          <Plus size={16} /> Upload New Document
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents by title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-800 focus:bg-white focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['All', 'Contract', 'Notice', 'Agreement', 'Deed', 'FIR'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                selectedType === type
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid / Table */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-3">
          <FileText size={40} className="mx-auto text-slate-300" />
          <h3 className="text-sm font-bold text-slate-800">No Documents Found</h3>
          <p className="text-xs text-slate-500">Upload your first legal document to get started.</p>
          <button
            onClick={() => navigate('/dashboard/upload')}
            className="inline-flex items-center gap-1.5 btn-primary text-xs mt-2"
          >
            <Plus size={14} /> Upload Document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => {
            const docId = doc._id || doc.id
            const docTitle = doc.title || doc.name || doc.originalFileName

            return (
              <motion.div
                key={docId}
                whileHover={{ y: -3 }}
                onClick={() => navigate(`/document/${docId}`)}
                className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs hover:border-indigo-500 hover:shadow-md transition-all relative flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 font-bold shrink-0">
                        <FileText size={18} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                          {doc.type || 'Legal Document'}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                          {docTitle}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <HardDrive size={12} /> {formatBytes(doc.fileSize || doc.size)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {doc.uploadedOn || new Date(doc.createdAt || Date.now()).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-800 px-2.5 py-0.5 text-[10px] font-bold border border-amber-200">
                    <Clock size={10} /> Waiting for AI Analysis
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/document/${docId}`)
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                      title="View Details"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(docId, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete Document"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
