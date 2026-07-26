import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Trash2, CheckCircle2 } from 'lucide-react'
import { documentsAPI } from '../../services/api'
import toast from 'react-hot-toast'

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 Bytes'
  if (typeof bytes === 'string') return bytes
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export default function AdminDocuments() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchDocuments = async () => {
    setLoading(true)
    try {
      const res = await documentsAPI.getDocuments()
      const list = res.data?.data?.documents || []
      setDocuments(list)
    } catch (err) {
      toast.error('Failed to load documents from server.')
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Admin action: Delete this user document?')) return

    try {
      await documentsAPI.deleteDocument(id)
      setDocuments((prev) => prev.filter((d) => (d._id || d.id) !== id))
      toast.success('Document deleted by Admin.')
    } catch (err) {
      toast.error(err.message || 'Failed to delete document.')
    }
  }

  const filtered = documents.filter((d) => {
    const title = d.title || d.name || d.originalFileName || ''
    return title.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-7xl mx-auto pb-12"
    >
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900">Uploaded Document Oversight</h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor and inspect all documents uploaded across user accounts in real time.
        </p>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-72">
          <Search size={15} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents by title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-800 focus:bg-white focus:border-indigo-500 outline-none transition-all"
          />
        </div>
        <span className="text-xs font-bold text-slate-500">Total Files: {filtered.length}</span>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 font-medium">
            No uploaded documents found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase font-semibold">
                  <th className="p-3">Document Title</th>
                  <th className="p-3">Format</th>
                  <th className="p-3">Size</th>
                  <th className="p-3">Uploaded Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filtered.map((d) => {
                  const id = d._id || d.id
                  const title = d.title || d.name || d.originalFileName
                  const format = (d.mimeType || '').split('/')[1]?.toUpperCase() || 'PDF'
                  const status = d.analysisStatus || d.ocrStatus || 'Uploaded'

                  return (
                    <tr key={id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-bold text-indigo-900">{title}</td>
                      <td className="p-3">{format}</td>
                      <td className="p-3 font-mono">{formatBytes(d.fileSize || d.size)}</td>
                      <td className="p-3 font-mono">
                        {new Date(d.createdAt || Date.now()).toLocaleDateString('en-IN')}
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold">
                          <CheckCircle2 size={12} /> {status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDelete(id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete File"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  )
}
