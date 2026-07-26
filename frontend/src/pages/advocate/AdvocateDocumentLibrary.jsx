import { useState } from 'react'
import { FileCheck2, Upload, Trash2, ShieldCheck, Download } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdvocateDocumentLibrary() {
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Bar_Council_Registration_Certificate.pdf', type: 'Certificate', size: '1.4 MB', date: '2026-01-10' },
    { id: 2, name: 'Delhi_High_Court_Advocate_ID.pdf', type: 'ID Proof', size: '820 KB', date: '2026-02-14' },
    { id: 3, name: 'Property_Law_Specialization_Diploma.pdf', type: 'Training Certificate', size: '2.1 MB', date: '2026-03-20' },
  ])

  const handleDelete = (id) => {
    setDocuments(documents.filter((d) => d.id !== id))
    toast.success('Document deleted from library')
  }

  const handleUpload = () => {
    toast.success('Document uploaded to Cloudinary library')
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FileCheck2 className="text-indigo-400" /> Advocate Verification & Document Library
          </h1>
          <p className="text-xs text-slate-400">
            Store Bar certificates, court ID proofs, legal publications, and training accreditations.
          </p>
        </div>

        <button
          onClick={handleUpload}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2.5 px-5 text-xs shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Upload size={15} /> Upload Certificate / ID
        </button>
      </div>

      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="rounded-2xl bg-slate-900 border border-slate-800 p-4 flex items-center justify-between gap-4 hover:border-slate-700 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <FileCheck2 size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{doc.name}</h4>
                <p className="text-[10px] text-slate-400">
                  {doc.type} • {doc.size} • Uploaded {doc.date}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toast.success('Downloading document...')}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Download"
              >
                <Download size={14} />
              </button>
              <button
                onClick={() => handleDelete(doc.id)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
