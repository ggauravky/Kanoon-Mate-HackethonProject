import { UserCheck, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function LawyerRecommendationCard({ lawyerRecommendation, recommendedAdvocateType, documentId }) {
  if (!lawyerRecommendation) return null

  const { urgency, reason } = lawyerRecommendation

  const getUrgencyBadge = (u) => {
    const norm = (u || 'within a few days').toLowerCase()
    if (norm.includes('immediately')) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-red-500/20 text-red-300 border border-red-500/30">
          Urgency: Hire Immediately
        </span>
      )
    }
    if (norm.includes('optional') || norm.includes('not necessary')) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30">
          Urgency: Optional / Self-Represent
        </span>
      )
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
        Urgency: Within a Few Days
      </span>
    )
  }

  return (
    <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-6 space-y-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-500/20 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <UserCheck size={18} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white">When Should You Hire a Lawyer?</h3>
            <p className="text-[11px] text-indigo-300">Specialization Needed: {recommendedAdvocateType || 'Civil Lawyer'}</p>
          </div>
        </div>

        {getUrgencyBadge(urgency)}
      </div>

      <p className="text-xs text-slate-200 leading-relaxed">
        {reason}
      </p>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
        <span className="text-xs text-slate-400 font-medium">
          Connect with top verified <strong className="text-white">{recommendedAdvocateType || 'Lawyers'}</strong> near your city.
        </span>

        <Link
          to={`/dashboard/advocates/recommended/${documentId}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold py-2.5 px-5 text-xs shadow-md transition-all shrink-0 hover:scale-[1.02] cursor-pointer"
        >
          <span>Find Recommended Advocates</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  )
}
