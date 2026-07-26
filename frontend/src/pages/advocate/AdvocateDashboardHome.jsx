import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Inbox,
  CheckCircle2,
  Eye,
  Star,
  Award,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  MapPin,
  FileText,
  AlertTriangle,
  Users,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { advocateAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function AdvocateDashboardHome() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const res = await advocateAPI.getDashboard()
      setData(res.data?.data)
    } catch (err) {
      console.warn('Dashboard fetch warning:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (requestId, status) => {
    try {
      await advocateAPI.updateRequestStatus(requestId, status)
      toast.success(`Client request ${status}`)
      fetchDashboardData()
    } catch (err) {
      toast.error(err.message || 'Failed to update request status')
    }
  }

  const advocateName = user?.name?.startsWith('Adv.') ? user.name : `Adv. ${user?.name || 'Rahul Sharma'}`
  const metrics = data?.metrics || {
    totalRequests: 18,
    acceptedRequests: 14,
    profileViews: 142,
    averageRating: 4.8,
    totalReviews: 15,
    yearsExperience: 14,
    completionPercentage: 85,
  }

  const profile = data?.profile || {}
  const recentRequests = data?.recentRequests || []
  const aiMatches = data?.aiMatches || []

  return (
    <div className="space-y-6">
      {/* ── Welcome Hero Banner ────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white border border-indigo-500/20 shadow-xl">
        <div className="absolute top-0 right-0 h-full w-1/3 bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck size={16} />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Bar Council Verified Advocate Console
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome Back, {advocateName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Manage client consultation inquiries, review AI-matched legal document cases, and monitor your practice reputation.
            </p>
          </div>

          {/* Quick Action Trigger */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/advocate/matched-clients"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 px-5 py-3 text-xs font-bold text-white shadow-lg transition-all hover:scale-[1.02]"
            >
              <Sparkles size={16} />
              <span>AI Matched Clients ({aiMatches.length})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Top Metric Cards Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Metric 1 */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Total Requests</span>
            <Inbox size={16} className="text-blue-400" />
          </div>
          <p className="text-xl font-extrabold text-white">{metrics.totalRequests}</p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Accepted</span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <p className="text-xl font-extrabold text-white">{metrics.acceptedRequests}</p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Profile Views</span>
            <Eye size={16} className="text-indigo-400" />
          </div>
          <p className="text-xl font-extrabold text-white">{metrics.profileViews}</p>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Avg Rating</span>
            <Star size={16} className="text-amber-400 fill-amber-400" />
          </div>
          <p className="text-xl font-extrabold text-white">{metrics.averageRating} ★</p>
        </div>

        {/* Metric 5 */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Reviews</span>
            <Award size={16} className="text-violet-400" />
          </div>
          <p className="text-xl font-extrabold text-white">{metrics.totalReviews}</p>
        </div>

        {/* Metric 6 */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Experience</span>
            <Clock size={16} className="text-rose-400" />
          </div>
          <p className="text-xl font-extrabold text-white">{metrics.yearsExperience} Yrs</p>
        </div>

        {/* Metric 7 */}
        <div className="col-span-2 md:col-span-1 rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Status</span>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-xs font-bold text-emerald-400">Available Online</p>
        </div>
      </div>

      {/* ── Main Grid: AI Matched Clients & Profile Completion ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Matched Clients (USP) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-indigo-400" />
              <h2 className="text-base font-bold text-white">AI Matched Clients (High Relevance)</h2>
            </div>
            <Link
              to="/advocate/matched-clients"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              View All <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {aiMatches.map((match) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3 relative hover:border-indigo-500/50 transition-all"
              >
                {/* Match Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-extrabold flex items-center gap-1">
                    <Sparkles size={11} /> {match.matchScore}% Match
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                    <MapPin size={12} className="text-rose-400" /> {match.clientCity}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white truncate">{match.documentTitle}</h3>
                  <p className="text-xs text-indigo-300 font-semibold">{match.legalCategory}</p>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  {match.summary}
                </p>

                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <span className="font-semibold text-slate-300">Reason:</span> {match.matchReason}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => toast.success(`Connected with ${match.clientName}`)}
                    className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-2 text-xs font-bold text-white shadow-xs transition-all"
                  >
                    Accept Case
                  </button>
                  <button
                    onClick={() => toast.success('Match saved to bookmarks')}
                    className="rounded-xl bg-slate-800 hover:bg-slate-700 p-2 text-slate-300 hover:text-white transition-colors text-xs font-semibold"
                  >
                    Bookmark
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Col: Profile Completion Widget */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Award size={18} className="text-indigo-400" /> Profile Completion
          </h2>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Profile Health</span>
              <span className="text-sm font-extrabold text-indigo-400">
                {metrics.completionPercentage}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${metrics.completionPercentage}%` }}
              />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Complete your advocate profile to increase search visibility and receive up to 3x more AI-matched client inquiries.
            </p>

            {/* Checklist */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400" /> Bar Registration No.
                </span>
                <span className="text-emerald-400 font-bold">Verified</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400" /> Practice Specializations
                </span>
                <span className="text-emerald-400 font-bold">Set</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <AlertTriangle size={14} className="text-amber-400" /> Weekly Availability Hours
                </span>
                <span className="text-amber-400 font-bold">Pending</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <AlertTriangle size={14} className="text-amber-400" /> Court & Case Achievements
                </span>
                <span className="text-amber-400 font-bold">Pending</span>
              </div>
            </div>

            <Link
              to="/advocate/profile"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 text-xs font-bold text-white transition-all border border-slate-700"
            >
              <span>Update Advocate Profile</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Recent Client Requests Table ────────────────────────────────────── */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Inbox size={18} className="text-indigo-400" /> Recent Client Inquiries & Requests
          </h2>
          <Link
            to="/advocate/client-requests"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            View All Requests <ArrowRight size={13} />
          </Link>
        </div>

        <div className="overflow-x-auto rounded-2xl bg-slate-900 border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Client Name</th>
                <th className="p-4">Legal Specialization</th>
                <th className="p-4">Location</th>
                <th className="p-4">Match %</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {recentRequests.map((req) => (
                <tr key={req._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-white">
                    {req.client?.fullName || req.clientName || 'Citizen User'}
                  </td>
                  <td className="p-4 text-indigo-300 font-semibold">{req.legalCategory}</td>
                  <td className="p-4 text-slate-300 flex items-center gap-1">
                    <MapPin size={12} className="text-rose-400" /> {req.clientCity || req.client?.city || 'Delhi'}
                  </td>
                  <td className="p-4 font-bold text-emerald-400">{req.matchScore}%</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        req.status === 'accepted'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : req.status === 'declined'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {req.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleStatusChange(req._id, 'accepted')}
                          className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                          title="Accept Request"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => handleStatusChange(req._id, 'declined')}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Decline Request"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
