import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Inbox, Check, X, MapPin, Search, Filter, ShieldAlert } from 'lucide-react'
import { advocateAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function AdvocateClientRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const res = await advocateAPI.getClientRequests()
      setRequests(res.data?.data?.requests || [])
    } catch (err) {
      console.warn('Requests error:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id, status) => {
    try {
      await advocateAPI.updateRequestStatus(id, status)
      toast.success(`Client request ${status}`)
      fetchRequests()
    } catch (err) {
      toast.error(err.message || 'Failed to update request')
    }
  }

  const filtered = requests.filter((r) => filterStatus === 'all' || r.status === filterStatus)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Inbox className="text-indigo-400" /> Client Consultation Requests
          </h1>
          <p className="text-xs text-slate-400">
            Review incoming legal consultation requests from citizens seeking representation.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 rounded-2xl bg-slate-900 p-1 border border-slate-800">
          {['all', 'pending', 'accepted', 'declined'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase transition-all ${
                filterStatus === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((req) => (
          <motion.div
            key={req._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-all"
          >
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-bold text-white">
                  {req.client?.fullName || req.clientName || 'Citizen User'}
                </h3>
                <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-lg border border-indigo-500/20">
                  {req.legalCategory}
                </span>
                <span className="text-xs text-emerald-400 font-bold">{req.matchScore}% AI Match</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                {req.summary}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-rose-400" /> {req.clientCity || req.client?.city || 'Delhi'}
                </span>
                <span>Risk Profile: <strong className="text-amber-400">{req.riskLevel || 'Medium'}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
              {req.status === 'pending' ? (
                <>
                  <button
                    onClick={() => handleUpdate(req._id, 'accepted')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                  >
                    <Check size={14} /> Accept Request
                  </button>
                  <button
                    onClick={() => handleUpdate(req._id, 'declined')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
                  >
                    <X size={14} /> Decline
                  </button>
                </>
              ) : (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                    req.status === 'accepted'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/10 text-red-400 border border-red-500/30'
                  }`}
                >
                  {req.status}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
