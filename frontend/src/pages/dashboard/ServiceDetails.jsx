import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ShieldCheck,
  Phone,
  Bookmark,
  MapPin,
  Clock,
  Landmark,
  HeartHandshake,
  Headphones,
  UserCheck,
  AlertCircle,
  Share2,
  Check,
} from 'lucide-react'
import { legalServicesAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import MapPlaceholder from '../../components/legalHelp/MapPlaceholder'
import ContactCard from '../../components/legalHelp/ContactCard'
import toast from 'react-hot-toast'

export default function ServiceDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [copied, setCopied] = useState(false)

  const FAVORITES_KEY = 'lawassist_favorite_services'

  useEffect(() => {
    let isMounted = true
    setLoading(true)

    legalServicesAPI
      .getServiceById(id)
      .then((res) => {
        if (isMounted && res.data?.data?.service) {
          const data = res.data.data.service
          setService(data)

          // Check bookmark state
          try {
            const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
            setIsBookmarked(saved.some((item) => (item._id || item.id) === data._id))
          } catch {
            setIsBookmarked(false)
          }
        }
      })
      .catch((err) => {
        toast.error('Failed to load service details.')
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [id])

  const toggleBookmark = () => {
    if (!service) return
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
    } catch {
      toast.error('Failed to update bookmarks')
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    toast.success('Resource details link copied to clipboard!')
    setTimeout(() => setCopied(false), 2500)
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  if (!service) {
    return (
      <div className="text-center py-12 space-y-4 max-w-md mx-auto">
        <AlertCircle size={40} className="mx-auto text-red-500" />
        <h3 className="text-lg font-bold text-slate-900">Resource Not Found</h3>
        <p className="text-xs text-slate-500">The requested legal service or helpline could not be located.</p>
        <button
          onClick={() => navigate('/dashboard/legal-help')}
          className="inline-flex items-center gap-2 btn-primary text-xs mx-auto"
        >
          <ArrowLeft size={14} /> Back to Legal Help Directory
        </button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-5xl mx-auto pb-12"
    >
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard/legal-help')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Legal Help Directory
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 text-xs font-semibold shadow-xs transition-colors"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
            <span>{copied ? 'Copied Link' : 'Share Resource'}</span>
          </button>

          <button
            onClick={toggleBookmark}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold shadow-xs transition-colors ${
              isBookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bookmark size={14} className={isBookmarked ? 'fill-amber-500 text-amber-600' : ''} />
            <span>{isBookmarked ? 'Bookmarked' : 'Save Bookmark'}</span>
          </button>
        </div>
      </div>

      <PageHeader
        title={service.name}
        subtitle={`${service.type} • ${service.category} • ${service.city}, ${service.state}`}
      />

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: About & Map Directions */}
        <div className="space-y-6 lg:col-span-2">
          {/* About Resource Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 px-3.5 py-1 text-xs font-bold">
                {service.type}
              </span>
              {service.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold border border-emerald-200">
                  <ShieldCheck size={14} /> Verified Resource
                </span>
              )}
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                About This Legal Resource
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {service.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="block text-slate-400 font-semibold uppercase text-[10px]">Legal Practice Area</span>
                <span className="font-bold text-slate-900">{service.category}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-semibold uppercase text-[10px]">Territorial Jurisdiction</span>
                <span className="font-bold text-slate-900">{service.city}, {service.state}</span>
              </div>
            </div>
          </div>

          {/* Interactive Map Directions Placeholder */}
          <MapPlaceholder
            name={service.name}
            address={service.address}
            city={service.city}
            state={service.state}
            latitude={service.latitude}
            longitude={service.longitude}
          />
        </div>

        {/* Right 1 Col: Contact Specs */}
        <div className="space-y-6 lg:col-span-1">
          <ContactCard service={service} />
        </div>
      </div>
    </motion.div>
  )
}
