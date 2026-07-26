import { useState } from 'react'
import { motion } from 'framer-motion'
import { HeartHandshake, Plus, Trash2, Edit3, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

const MOCK_SERVICES = [
  { id: 's_1', name: 'Advocate Legal Consultation', category: 'Directory', status: 'Active' },
  { id: 's_2', name: 'NALSA Legal Aid Finder', category: 'Free Aid', status: 'Active' },
  { id: 's_3', name: 'e-Daakhil Consumer Complaint Step-by-Step', category: 'Guide', status: 'Active' },
  { id: 's_4', name: 'Cyber Crime 1930 Helpline Assistant', category: 'Emergency', status: 'Active' },
]

export default function AdminLegalServices() {
  const [services, setServices] = useState(MOCK_SERVICES)

  const handleDelete = (id) => {
    if (!window.confirm('Delete service entry?')) return
    setServices((prev) => prev.filter((s) => s.id !== id))
    toast.success('Service entry removed.')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-7xl mx-auto pb-12"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Legal Help Hub Directory Management</h1>
          <p className="text-xs text-slate-500 mt-1">Manage advocate directory entries, legal aid centers, and e-Daakhil guides.</p>
        </div>
        <button onClick={() => toast.success('Add service modal (Demo)')} className="btn-primary text-xs gap-1">
          <Plus size={14} /> Add Service Entry
        </button>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase font-semibold">
                <th className="p-3">Service Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-bold text-indigo-900">{s.name}</td>
                  <td className="p-3">{s.category}</td>
                  <td className="p-3 font-bold text-emerald-600">{s.status}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => handleDelete(s.id)} className="p-1.5 text-slate-400 hover:text-red-600">
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
