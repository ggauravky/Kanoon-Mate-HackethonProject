import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, FileText, MapPin, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react'
import AdvocateCard from '../../components/advocates/AdvocateCard'
import { advocatesAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function RecommendedAdvocates() {
  const { documentId } = useParams()
  const { user } = useAuth()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRecommendations()
  }, [documentId])

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      const res = await advocatesAPI.getRecommended(documentId)
      setData(res.data?.data || null)
    } catch (err) {
      setError(err.message || 'Failed to load recommendations')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-6">
        <div className="h-32 rounded-3xl bg-[var(--color-surface-alt)]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="h-64 rounded-2xl bg-[var(--color-surface-alt)]" />
          <div className="h-64 rounded-2xl bg-[var(--color-surface-alt)]" />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center space-y-3">
        <p className="text-sm font-bold text-red-700">{error || 'Could not load AI recommendations'}</p>
        <Link to="/dashboard/documents" className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-semibold">
          <ArrowLeft size={14} /> Return to My Documents
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Back button */}
      <Link
        to={`/dashboard/analysis/${documentId}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-muted)] hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Document AI Analysis
      </Link>

      {/* Top AI Match Header */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                <Sparkles size={18} className="animate-pulse" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                AI Advocate Matcher
              </span>
            </div>

            <h1 className="text-2xl font-extrabold text-white">
              Matching Advocates for "{data.documentTitle}"
            </h1>

            <p className="text-xs text-indigo-200 flex items-center gap-2">
              <FileText size={14} />
              <span>Detected Category: <strong className="text-white">{data.detectedCategory}</strong></span>
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0 text-right">
            <p className="text-[11px] text-slate-300">Matching Location</p>
            <p className="text-sm font-bold text-white flex items-center justify-end gap-1">
              <MapPin size={14} className="text-rose-400" />
              {data.userLocation?.city}, {data.userLocation?.state}
            </p>
          </div>
        </div>
      </div>

      {/* Recommended List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-[var(--color-text)] flex items-center gap-2">
          <span>Top Advocate Matches ({data.matches?.length || 0})</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {data.matches?.map((match) => (
            <div key={match.id} className="relative">
              <div className="absolute -top-3 left-4 z-10 rounded-full bg-emerald-600 text-white px-3 py-0.5 text-[10px] font-bold shadow-md flex items-center gap-1">
                <Sparkles size={11} /> {match.matchScore} AI Match
              </div>
              <AdvocateCard advocate={match.advocate} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
