import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, MapPin, CheckCircle, ShieldCheck, ArrowRight, Phone, ExternalLink, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { advocatesAPI } from '../../services/api'

export default function RecommendationBanner({ documentId }) {
  const [recommendationData, setRecommendationData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!documentId) return
    const fetchRecommendations = async () => {
      try {
        setLoading(true)
        const res = await advocatesAPI.getRecommended(documentId)
        setRecommendationData(res.data?.data || null)
      } catch (err) {
        console.warn('Failed to load advocate recommendations:', err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchRecommendations()
  }, [documentId])

  if (loading) {
    return (
      <div className="rounded-3xl bg-slate-900 text-white p-6 animate-pulse">
        <div className="h-5 w-48 bg-slate-700 rounded mb-4" />
        <div className="h-12 bg-slate-800 rounded-xl" />
      </div>
    )
  }

  if (!recommendationData || !recommendationData.matches || recommendationData.matches.length === 0) {
    return null
  }

  const topMatch = recommendationData.matches[0]
  const advocate = topMatch.advocate || {}
  const user = advocate.user || {}

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-2xl border border-indigo-500/30"
    >
      {/* Decorative Glow */}
      <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

      {/* Top Banner Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-indigo-800/60 mb-5">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            <Sparkles size={18} className="animate-pulse" />
          </span>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              AI Advocate Match Engine
            </span>
            <h3 className="text-sm font-semibold text-white">
              Recommended Lawyers for "{recommendationData.documentTitle || 'Your Document'}"
            </h3>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
          <Star size={13} className="fill-emerald-400" />
          {topMatch.matchScore} Match Score
        </span>
      </div>

      {/* Top Match Highlight Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-7 space-y-4">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 shrink-0 rounded-2xl bg-indigo-800 overflow-hidden border-2 border-indigo-400/50">
              {user.profilePicture || advocate.profileImage ? (
                <img src={user.profilePicture || advocate.profileImage} alt={user.fullName} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-bold text-xl text-indigo-200">
                  {(user.fullName || 'A')[0]}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold text-white">{user.fullName || 'Adv. Legal Specialist'}</h4>
                <ShieldCheck size={16} className="text-emerald-400" />
              </div>
              <p className="text-xs font-medium text-indigo-200">
                {advocate.practiceAreas?.[0] || 'Legal Counsel'} Specialist
              </p>
              <div className="mt-1 flex items-center gap-1 text-xs text-slate-300">
                <MapPin size={13} className="text-rose-400" />
                <span>{advocate.city}, {advocate.state}</span>
              </div>
            </div>
          </div>

          {/* AI Reason Bullets */}
          <div className="space-y-1.5 pt-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Why AI Recommended This Lawyer:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
              {topMatch.reasons?.map((reason, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                  <span>{reason.replace(/^✔\s*/, '')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Column */}
        <div className="md:col-span-5 flex flex-col gap-3 justify-center bg-black/20 p-5 rounded-2xl border border-indigo-500/20">
          <div className="text-center md:text-left">
            <p className="text-xs text-slate-300">Consultation Fee</p>
            <p className="text-xl font-extrabold text-white">₹{advocate.consultationFee || 1000} <span className="text-xs font-normal text-slate-400">/ session</span></p>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              to={`/dashboard/advocates/${advocate._id}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold py-2.5 px-4 text-xs shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
            >
              <span>View Lawyer Profile</span>
              <ArrowRight size={14} />
            </Link>

            <Link
              to={`/dashboard/advocates?category=${encodeURIComponent(recommendationData.detectedCategory)}`}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 py-2 px-3 text-xs font-semibold transition-all"
            >
              <span>See All {recommendationData.matches.length} Matches</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
