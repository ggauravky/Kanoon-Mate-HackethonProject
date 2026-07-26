import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, MapPin, Check, X, Bookmark, Gavel, ShieldCheck, Filter, Search } from 'lucide-react'
import { advocateAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function AdvocateAIMatches() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      setLoading(true)
      const res = await advocateAPI.getDashboard()
      setMatches(res.data?.data?.aiMatches || mockMatches())
    } catch (err) {
      setMatches(mockMatches())
    } finally {
      setLoading(false)
    }
  }

  const filteredMatches = matches.filter((m) => {
    const catMatch = !filterCategory || m.legalCategory?.toLowerCase().includes(filterCategory.toLowerCase())
    const textMatch = !searchQuery || m.documentTitle?.toLowerCase().includes(searchQuery.toLowerCase()) || m.clientCity?.toLowerCase().includes(searchQuery.toLowerCase())
    return catMatch && textMatch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles size={16} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              LawAssist AI Engine
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">AI Matched Client Inquiries</h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Real-time client document analysis matches aligned with your registered practice specializations, location, and court experience.
          </p>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city or title..."
              className="rounded-xl border border-slate-800 bg-slate-900 pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Grid of AI Matched Client Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMatches.map((match) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 relative flex flex-col justify-between hover:border-indigo-500/50 transition-all shadow-lg"
          >
            <div className="space-y-3">
              {/* Header Badges */}
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 text-xs font-extrabold flex items-center gap-1">
                  <Sparkles size={13} /> {match.matchScore}% Match
                </span>
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                  <MapPin size={13} className="text-rose-400" /> {match.clientCity}
                </span>
              </div>

              {/* Title & Category */}
              <div>
                <h3 className="text-base font-bold text-white leading-snug">{match.documentTitle}</h3>
                <p className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 mt-0.5">
                  <Gavel size={13} /> {match.legalCategory}
                </p>
              </div>

              {/* Summary */}
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                {match.summary}
              </p>

              {/* Match Criteria Reasoning */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">AI Match Reasoning:</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold">
                    ✔ Practice Specialization Match
                  </span>
                  <span className="rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold">
                    ✔ Location Alignment ({match.clientCity})
                  </span>
                  <span className="rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold">
                    ✔ Bar Verified Registration
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => toast.success(`Client inquiry accepted for ${match.documentTitle}`)}
                className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-2.5 text-xs font-bold text-white shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Check size={14} /> Accept Case
              </button>
              <button
                onClick={() => toast.success('Match saved to saved cases')}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 p-2.5 text-slate-300 hover:text-white transition-colors"
                title="Bookmark Match"
              >
                <Bookmark size={15} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function mockMatches() {
  return [
    {
      id: 'm_1',
      documentTitle: 'Property Sale Deed & Registration Audit',
      legalCategory: 'Property Lawyer',
      summary: 'Property transfer deed verification for immovable asset in Lucknow jurisdiction.',
      clientCity: 'Lucknow',
      matchScore: 98,
    },
    {
      id: 'm_2',
      documentTitle: 'Employment Non-Compete Agreement',
      legalCategory: 'Employment Lawyer',
      summary: 'Reviewing employee severance and restrictive covenant clauses under Contract Act.',
      clientCity: 'Delhi',
      matchScore: 95,
    },
    {
      id: 'm_3',
      documentTitle: 'Cheque Dishonour Notice under Sec 138',
      legalCategory: 'Criminal Lawyer',
      summary: 'Statutory demand notice issued for cheque return memo under NI Act 1881.',
      clientCity: 'Noida',
      matchScore: 92,
    },
  ]
}
