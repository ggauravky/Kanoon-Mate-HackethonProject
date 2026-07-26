import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin,
  Star,
  ShieldCheck,
  Phone,
  Bookmark,
  ExternalLink,
  Video,
  Building,
  Award,
  Globe,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { advocatesAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function AdvocateCard({ advocate, isFavoriteInitial = false, onFavoriteToggle }) {
  const [isFavorite, setIsFavorite] = useState(isFavoriteInitial)
  const [favLoading, setFavLoading] = useState(false)

  const profile = advocate.user ? advocate : advocate.advocate || advocate
  const user = profile.user || {}

  const handleFavoriteClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setFavLoading(true)
    try {
      const res = await advocatesAPI.toggleFavorite(profile._id)
      const nextFav = res.data?.data?.isFavorite
      setIsFavorite(nextFav)
      toast.success(
        nextFav ? 'Saved to Favorite Advocates!' : 'Removed from Favorites.'
      )
      if (onFavoriteToggle) onFavoriteToggle(profile._id, nextFav)
    } catch (err) {
      toast.error(err.message || 'Failed to update favorites.')
    } finally {
      setFavLoading(false)
    }
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col justify-between rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-surface)] p-5 shadow-sm hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-600 transition-all"
    >
      <div>
        {/* Header: Photo + Rating + Bookmark */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-indigo-100 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800">
              {user.profilePicture || profile.profileImage ? (
                <img
                  src={user.profilePicture || profile.profileImage}
                  alt={user.fullName || 'Advocate'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 text-lg">
                  {(user.fullName || 'A')[0]}
                </div>
              )}
              {profile.verified && (
                <span
                  className="absolute bottom-0 right-0 rounded-full bg-emerald-500 p-0.5 text-white ring-2 ring-white dark:ring-slate-900"
                  title="Verified Advocate"
                >
                  <ShieldCheck size={11} />
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-[var(--color-text)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {user.fullName || 'Adv. Legal Counsel'}
                </h3>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] font-medium">
                {profile.practiceAreas?.[0] || 'Legal Specialist'}
              </p>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-[var(--color-text-muted)]">
                <span className="flex items-center gap-0.5 font-semibold text-amber-500">
                  <Star size={12} className="fill-amber-400" />
                  {profile.rating || 4.8}
                </span>
                <span>({profile.totalReviews || 12} reviews)</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleFavoriteClick}
            disabled={favLoading}
            className={`rounded-xl p-2 border transition-all ${
              isFavorite
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)]'
            }`}
            title={isFavorite ? 'Remove from Favorites' : 'Save to Favorites'}
          >
            <Bookmark size={16} className={isFavorite ? 'fill-indigo-600 dark:fill-indigo-400' : ''} />
          </button>
        </div>

        {/* Practice Areas Badges */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {profile.practiceAreas?.slice(0, 3).map((area, idx) => (
            <span
              key={idx}
              className="rounded-lg bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/40"
            >
              {area}
            </span>
          ))}
        </div>

        {/* Info Grid */}
        <div className="mt-4 space-y-2 text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border-light)] pt-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Award size={13} className="text-indigo-500" />
              <span>{profile.experience || 5}+ Yrs Exp</span>
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
              ₹{profile.consultationFee || 1000} / Consult
            </span>
          </div>

          <div className="flex items-center gap-1 truncate">
            <MapPin size={13} className="text-rose-500 shrink-0" />
            <span className="truncate">
              {profile.city}, {profile.state}
            </span>
          </div>

          {profile.languages?.length > 0 && (
            <div className="flex items-center gap-1 truncate">
              <Globe size={13} className="text-blue-500 shrink-0" />
              <span className="truncate">{profile.languages.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Availability Pills */}
        <div className="mt-3 flex items-center gap-2">
          {profile.onlineAvailable && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50">
              <Video size={10} /> Online
            </span>
          )}
          {profile.offlineAvailable && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50">
              <Building size={10} /> Office Visit
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 flex items-center gap-2 pt-3 border-t border-[var(--color-border-light)]">
        <Link
          to={`/dashboard/advocates/${profile._id}`}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-alt)] py-2 text-xs font-semibold text-[var(--color-text)] transition-colors"
        >
          <span>View Profile</span>
          <ExternalLink size={13} />
        </Link>
        <a
          href={`tel:${user.phone || '+919876543210'}`}
          className="flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white p-2 text-xs font-semibold transition-colors"
          title="Contact Advocate"
        >
          <Phone size={14} />
        </a>
      </div>
    </motion.div>
  )
}
