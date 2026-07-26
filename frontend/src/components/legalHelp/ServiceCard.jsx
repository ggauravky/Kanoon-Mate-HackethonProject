import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Bookmark,
  ExternalLink,
  ChevronRight,
  Landmark,
  UserCheck,
  HeartHandshake,
  Headphones,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function ServiceCard({ service, onBookmarkToggle }) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  const FAVORITES_KEY = 'kanoon_mate_favorite_services'

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
      setIsBookmarked(saved.some((item) => (item._id || item.id) === (service._id || service.id)))
    } catch {
      setIsBookmarked(false)
    }
  }, [service])

  const toggleBookmark = (e) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
      const targetId = service._id || service.id
      const exists = saved.some((item) => (item._id || item.id) === targetId)

      let updated = []
      if (exists) {
        updated = saved.filter((item) => (item._id || item.id) !== targetId)
        toast.success('Removed from Bookmarks')
        setIsBookmarked(false)
      } else {
        updated = [...saved, service]
        toast.success('Saved to Bookmarks!')
        setIsBookmarked(true)
      }

      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
      if (onBookmarkToggle) onBookmarkToggle(service, !exists)
    } catch {
      toast.error('Failed to update bookmarks')
    }
  }

  // Type Icon helper
  const getTypeIcon = (type) => {
    switch (type) {
      case 'Government Legal Aid':
      case 'DLSA':
        return <Landmark size={16} className="text-indigo-600" />
      case 'Helpline':
        return <Headphones size={16} className="text-emerald-600" />
      case 'NGO':
        return <HeartHandshake size={16} className="text-amber-600" />
      case 'Verified Advocate':
        return <UserCheck size={16} className="text-indigo-600" />
      default:
        return <ShieldCheck size={16} className="text-indigo-600" />
    }
  }

  return (
    <motion.div
      layout
      whileHover={{ y: -3 }}
      className="group rounded-3xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between"
    >
      <div className="space-y-3">
        {/* Header Badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-800 px-3 py-1 text-[11px] font-bold">
              {getTypeIcon(service.type)}
              <span>{service.type}</span>
            </span>

            <span className="rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              {service.category}
            </span>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-xl border transition-colors ${
              isBookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-600'
                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Service'}
          >
            <Bookmark size={15} className={isBookmarked ? 'fill-amber-500' : ''} />
          </button>
        </div>

        {/* Title & Verification */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
            <span>{service.name}</span>
            {service.verified && (
              <ShieldCheck size={16} className="text-indigo-600 shrink-0" title="Verified Legal Aid Resource" />
            )}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Location & Details Specs */}
        <div className="space-y-2 text-xs text-slate-600 pt-1">
          <div className="flex items-start gap-2">
            <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
            <span className="line-clamp-1">
              {service.address ? `${service.address}, ` : ''}
              <strong className="text-slate-900">{service.city}</strong>, {service.state}
            </span>
          </div>

          {service.phone && (
            <div className="flex items-center gap-2 font-mono font-semibold text-slate-900">
              <Phone size={14} className="text-indigo-600 shrink-0" />
              <span>{service.phone}</span>
            </div>
          )}

          {service.workingHours && (
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <Clock size={13} className="text-slate-400 shrink-0" />
              <span>{service.workingHours}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        {service.phone ? (
          <a
            href={`tel:${service.phone}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white py-2 text-xs font-bold shadow-xs transition-colors"
          >
            <Phone size={13} /> Call Resource
          </a>
        ) : (
          <span className="text-[11px] text-slate-400 font-medium">Free Legal Guidance</span>
        )}

        <Link
          to={`/dashboard/legal-help/${service._id || service.id}`}
          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-2 text-xs font-bold transition-colors"
        >
          <span>Details</span>
          <ChevronRight size={14} />
        </Link>
      </div>
    </motion.div>
  )
}
