import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  Search,
  Bookmark,
  Landmark,
  Headphones,
  HeartHandshake,
  UserCheck,
  Loader2,
  AlertCircle,
  Sparkles,
} from 'lucide-react'
import { legalServicesAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import EmergencyBanner from '../../components/legalHelp/EmergencyBanner'
import SearchBar from '../../components/legalHelp/SearchBar'
import CategoryFilter from '../../components/legalHelp/CategoryFilter'
import ServiceCard from '../../components/legalHelp/ServiceCard'

const SERVICE_TYPES = [
  'Government Legal Aid',
  'DLSA',
  'Helpline',
  'NGO',
  'Verified Advocate',
]

const CATEGORIES = [
  'Family Law',
  'Property Law',
  'Criminal Law',
  'Consumer Law',
  'Cyber Crime',
  'Employment',
  'Women Safety',
  'Senior Citizen',
  'Child Protection',
]

export default function LegalHelp() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [bookmarkCount, setBookmarkCount] = useState(0)

  const fetchServices = async () => {
    setLoading(true)
    try {
      const res = await legalServicesAPI.getServices({
        search,
        type: selectedType,
        category: selectedCategory,
        city: selectedCity,
      })
      if (res.data?.data?.services) {
        setServices(res.data.data.services)
      }
    } catch (err) {
      console.warn('Error loading services:', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [search, selectedType, selectedCategory, selectedCity])

  // Count bookmarks from localStorage
  const updateBookmarkCount = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('kanoon_mate_favorite_services') || '[]')
      setBookmarkCount(saved.length)
    } catch {
      setBookmarkCount(0)
    }
  }

  useEffect(() => {
    updateBookmarkCount()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-6xl mx-auto pb-12"
    >
      <div className="flex items-center justify-between">
        <PageHeader
          title="Legal Help & Services Hub"
          subtitle="Discover government legal aid, DLSAs, national emergency helplines, NGOs, and verified advocates"
        />

        {/* Bookmarks Link */}
        <Link
          to="/dashboard/favorites"
          className="inline-flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 px-4 py-2 text-xs font-bold transition-colors shrink-0"
        >
          <Bookmark size={15} className="fill-amber-500 text-amber-600" />
          <span>Saved Bookmarks</span>
          {bookmarkCount > 0 && (
            <span className="rounded-full bg-amber-500 text-white px-2 py-0.5 text-[10px] font-extrabold">
              {bookmarkCount}
            </span>
          )}
        </Link>
      </div>

      {/* 🚨 Emergency Banner (Always Visible) */}
      <EmergencyBanner />

      {/* Search & Location Filters */}
      <SearchBar
        search={search}
        setSearch={setSearch}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        serviceTypes={SERVICE_TYPES}
      />

      {/* Category Chips Bar */}
      <CategoryFilter
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Main Results Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="animate-spin text-indigo-600" />
            <p className="text-xs font-medium text-slate-500">Searching legal services & helplines...</p>
          </div>
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center space-y-3">
          <AlertCircle size={40} className="mx-auto text-slate-400" />
          <h3 className="text-base font-bold text-slate-900">No Legal Resources Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search criteria, city name, or select a different legal category.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>Showing {services.length} verified legal aid & helpline resources</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => (
              <ServiceCard
                key={service._id || service.id}
                service={service}
                onBookmarkToggle={updateBookmarkCount}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
