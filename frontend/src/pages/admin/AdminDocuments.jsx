import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Search, Trash2, Eye, CheckCircle2, AlertTriangle, HardDrive } from 'lucide-react'
import { mockDocuments } from '../../data/mockData'
import toast from 'react-hot-toast'

export default function AdminDocuments() {
  const [documents, setDocuments] = useState(mockDocuments)
  const [search, setSearch] = useState('')

  const handleDelete = (id) => {
    if (!window.confirm('Admin action: Delete this user document?')) return
    setDocuments((prev) => prev.filter((d) => d.id !== id))
    toast.success('Document deleted by Admin.')
  }

  const filtered = documents.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))

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
          Monitor and inspect all documents uploaded across user accounts.
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
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase font-semibold">
                <th className="p-3">Document Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Size</th>
                <th className="p-3">Uploaded Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-bold text-indigo-900">{d.name}</td>
                  <td className="p-3">{d.type}</td>
                  <td className="p-3 font-mono">{d.size}</td>
                  <td className="p-3 font-mono">{d.uploadedOn}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold">
                      <CheckCircle2 size={12} /> {d.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete File"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
