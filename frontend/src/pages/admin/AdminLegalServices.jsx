import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, ShieldCheck } from 'lucide-react'
import { legalServicesAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminLegalServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchServices = async () => {
    setLoading(true)
    try {
      const res = await legalServicesAPI.getServices()
      const list = res.data?.data?.services || []
      setServices(list)
    } catch (err) {
      toast.error('Failed to load legal service entries.')
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-7xl mx-auto pb-12"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Legal Help Hub Directory Oversight</h1>
          <p className="text-xs text-slate-500 mt-1">Monitor NALSA centers, DLSAs, emergency helplines, and advocate listings.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          </div>
        ) : services.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 font-medium">
            No legal service entries found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase font-semibold">
                  <th className="p-3">Resource Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {services.map((s) => (
                  <tr key={s._id || s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold text-indigo-900">{s.name}</td>
                    <td className="p-3">{s.type}</td>
                    <td className="p-3 font-bold text-indigo-600">{s.category}</td>
                    <td className="p-3">{s.city}, {s.state}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        s.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        <ShieldCheck size={12} />
                        {s.verified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  )
}
