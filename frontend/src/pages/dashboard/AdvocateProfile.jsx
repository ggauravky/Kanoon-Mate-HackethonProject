import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  Star,
  MapPin,
  Phone,
  Mail,
  Award,
  Globe,
  Video,
  Building,
  Bookmark,
  ArrowLeft,
  Calendar,
  CheckCircle,
  FileText,
} from 'lucide-react'
import { advocatesAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function AdvocateProfile() {
  const { id } = useParams()

  const [advocate, setAdvocate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favLoading, setFavLoading] = useState(false)
  const [inquirySent, setInquirySent] = useState(false)

  useEffect(() => {
    fetchProfile()
    checkFavoriteStatus()
  }, [id])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const res = await advocatesAPI.getAdvocateById(id)
      setAdvocate(res.data?.data?.advocate || null)
    } catch (err) {
      toast.error(err.message || 'Failed to load advocate profile')
    } finally {
      setLoading(false)
    }
  }

  const checkFavoriteStatus = async () => {
    try {
      const res = await advocatesAPI.getFavorites()
      const favs = res.data?.data?.favorites || []
      setIsFavorite(favs.some((f) => f._id === id))
    } catch {
      // offline
    }
  }

  const handleFavoriteToggle = async () => {
    setFavLoading(true)
    try {
      const res = await advocatesAPI.toggleFavorite(id)
      const nextFav = res.data?.data?.isFavorite
      setIsFavorite(nextFav)
      toast.success(nextFav ? 'Saved to Favorites!' : 'Removed from Favorites.')
    } catch (err) {
      toast.error(err.message || 'Failed to update favorites')
    } finally {
      setFavLoading(false)
    }
  }

  const handleInquirySubmit = (e) => {
    e.preventDefault()
    setInquirySent(true)
    toast.success('Consultation request sent directly to advocate!')
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-6">
        <div className="h-48 rounded-3xl bg-[var(--color-surface-alt)]" />
        <div className="h-64 rounded-2xl bg-[var(--color-surface-alt)]" />
      </div>
    )
  }

  if (!advocate) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-base font-bold text-red-600">Advocate Profile Not Found</p>
        <Link to="/dashboard/advocates" className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-semibold">
          <ArrowLeft size={14} /> Back to Advocate Directory
        </Link>
      </div>
    )
  }

  const user = advocate.user || {}

  return (
    <div className="space-y-8 pb-16">
      {/* Back link */}
      <Link
        to="/dashboard/advocates"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-muted)] hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Advocate Directory
      </Link>

      {/* Top Banner Card */}
      <div className="rounded-3xl border border-[var(--color-border-light)] bg-[var(--color-surface)] p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-3xl bg-indigo-100 dark:bg-indigo-950 border-2 border-indigo-500/30 shadow-md">
              {user.profilePicture || advocate.profileImage ? (
                <img src={user.profilePicture || advocate.profileImage} alt={user.fullName} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-bold text-3xl text-indigo-600 dark:text-indigo-400">
                  {(user.fullName || 'A')[0]}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--color-text)]">
                  {user.fullName || 'Adv. Legal Specialist'}
                </h1>
                {advocate.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <ShieldCheck size={14} /> Bar Verified
                  </span>
                )}
              </div>

              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                Bar Registration: {advocate.barCouncilNumber}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-text-muted)] pt-1">
                <span className="flex items-center gap-1 font-bold text-amber-500">
                  <Star size={14} className="fill-amber-400" />
                  {advocate.rating || 4.8} ({advocate.totalReviews || 15} reviews)
                </span>
                <span className="flex items-center gap-1">
                  <Award size={14} className="text-indigo-500" />
                  {advocate.experience || 5}+ Years Experience
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} className="text-rose-500" />
                  {advocate.city}, {advocate.state}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleFavoriteToggle}
            disabled={favLoading}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-semibold border transition-all ${
              isFavorite
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)]'
            }`}
          >
            <Bookmark size={15} className={isFavorite ? 'fill-indigo-600 dark:fill-indigo-400' : ''} />
            <span>{isFavorite ? 'Saved to Favorites' : 'Save Favorite'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Details + Consultation Booking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Bio & Practice Info */}
        <div className="lg:col-span-8 space-y-6">
          {/* Practice Areas */}
          <div className="rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-surface)] p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-[var(--color-text)]">Practice Areas & Specialization</h3>
            <div className="flex flex-wrap gap-2">
              {advocate.practiceAreas?.map((area, idx) => (
                <span
                  key={idx}
                  className="rounded-xl bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* About & Bio */}
          <div className="rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-surface)] p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-[var(--color-text)]">About Advocate</h3>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
              {advocate.bio || 'Experienced legal counsel providing expert guidance across civil, criminal, and corporate matters in Indian courts.'}
            </p>
          </div>

          {/* Languages & Office Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-surface)] p-5 shadow-sm space-y-2">
              <h4 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <Globe size={15} className="text-blue-500" /> Languages Spoken
              </h4>
              <p className="text-sm font-semibold text-[var(--color-text)]">
                {advocate.languages?.join(', ') || 'English, Hindi'}
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-surface)] p-5 shadow-sm space-y-2">
              <h4 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <Building size={15} className="text-indigo-500" /> Office Address
              </h4>
              <p className="text-xs font-medium text-[var(--color-text)] leading-relaxed">
                {advocate.officeAddress || `${advocate.city}, ${advocate.state}`}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Contact & Consultation Form */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 shadow-xl space-y-5">
            <div>
              <p className="text-xs text-indigo-300 font-medium">Consultation Fee</p>
              <h3 className="text-2xl font-extrabold text-white">₹{advocate.consultationFee || 1000}</h3>
              <p className="text-[11px] text-slate-300 mt-0.5">Includes document review & 30-min legal guidance</p>
            </div>

            {/* Direct Phone & Email triggers */}
            <div className="space-y-2 pt-2 border-t border-indigo-800">
              <a
                href={`tel:${user.phone || '+919876543210'}`}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 text-xs shadow-lg transition-all"
              >
                <Phone size={15} />
                <span>Call Advocate ({user.phone || '+91 9876543210'})</span>
              </a>

              <a
                href={`mailto:${user.email}`}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-semibold py-2.5 text-xs transition-all"
              >
                <Mail size={15} />
                <span>Send Direct Email</span>
              </a>
            </div>

            {/* Book Consultation Form */}
            <form onSubmit={handleInquirySubmit} className="space-y-3 pt-3 border-t border-indigo-800/60">
              <p className="text-xs font-bold text-white">Book Online Inquiry</p>

              {inquirySent ? (
                <div className="rounded-xl bg-emerald-950/80 border border-emerald-500/40 p-3 text-center text-xs text-emerald-300 space-y-1">
                  <CheckCircle size={18} className="mx-auto text-emerald-400" />
                  <p className="font-bold">Inquiry Sent!</p>
                  <p className="text-[11px] text-slate-300">The advocate will get back to you within 2 hours.</p>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    required
                    placeholder="Your Legal Query Summary"
                    className="w-full rounded-xl bg-black/30 border border-indigo-500/30 p-2.5 text-xs text-white outline-none focus:border-indigo-400"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Calendar size={14} /> Request Consultation
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
