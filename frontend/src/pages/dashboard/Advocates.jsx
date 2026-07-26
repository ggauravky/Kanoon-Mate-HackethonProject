import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Search,
  Sparkles,
  MapPin,
  SlidersHorizontal,
  Bookmark,
  Building,
  CheckCircle,
} from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import AdvocateCard from '../../components/advocates/AdvocateCard'
import FilterPanel from '../../components/advocates/FilterPanel'
import { advocatesAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function Advocates() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const [advocates, setAdvocates] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'favorites'
  const [totalCount, setTotalCount] = useState(0)

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    practiceArea: searchParams.get('category') || searchParams.get('practiceArea') || '',
    city: searchParams.get('city') || '',
    minExperience: '',
    minRating: '',
    onlineAvailable: '',
    offlineAvailable: '',
    sortBy: 'rating',
  })

  useEffect(() => {
    fetchAdvocates()
    fetchFavorites()
  }, [filters, activeTab])

  const fetchAdvocates = async () => {
    try {
      setLoading(true)
      const res = await advocatesAPI.getAdvocates(filters)
      const list = res.data?.data?.advocates || []
      setAdvocates(list)
      setTotalCount(res.data?.total ?? list.length)
    } catch (err) {
      console.warn('Failed to load advocates:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchFavorites = async () => {
    try {
      const res = await advocatesAPI.getFavorites()
      const favList = res.data?.data?.favorites || []
      setFavorites(favList.map((f) => f._id || f.id))
    } catch {
      // Silently fail if not logged in or offline
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleResetFilters = () => {
    setFilters({
      search: '',
      practiceArea: '',
      city: '',
      minExperience: '',
      minRating: '',
      onlineAvailable: '',
      offlineAvailable: '',
      sortBy: 'rating',
    })
  }

  const displayedList =
    activeTab === 'favorites'
      ? advocates.filter((a) => favorites.includes(a._id))
      : advocates

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-full w-1/3 bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                <Users size={18} />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Lawyer Directory & AI Matching
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Connect with Verified Advocates Near You
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-xl">
              Find experienced Indian legal professionals filtered by document analysis, practice specialization, location, and verified Bar Council registration.
            </p>
          </div>

          {/* Quick Location Badge */}
          <button
            onClick={() => handleFilterChange('city', filters.city === (user?.city || '') ? '' : (user?.city || ''))}
            className={`flex items-center gap-3 p-3 rounded-2xl border transition-all shrink-0 cursor-pointer ${
              filters.city === (user?.city || '')
                ? 'bg-indigo-600 text-white border-indigo-400'
                : 'bg-white/10 backdrop-blur-md text-white border-white/10 hover:bg-white/20'
            }`}
            title="Click to toggle filtering by your city"
          >
            <MapPin size={20} className="text-rose-400" />
            <div className="text-left">
              <p className="text-[11px] text-slate-300 font-medium">
                {filters.city ? 'Filtering by City' : 'Your Current Location'}
              </p>
              <p className="text-sm font-bold text-white">{user?.city || 'Delhi'}, {user?.state || 'Delhi'}</p>
            </div>
          </button>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[var(--color-border-light)] pb-4">
        <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-[var(--color-surface-alt)] p-1 border border-[var(--color-border)]">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-[var(--color-surface)] text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <Users size={14} />
            <span>All Advocates ({totalCount || advocates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'favorites'
                ? 'bg-[var(--color-surface)] text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <Bookmark size={14} />
            <span>Saved Favorites ({favorites.length})</span>
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-text-muted)] font-medium">Sort By:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-1.5 px-3 text-xs font-medium text-[var(--color-text)] outline-none focus:border-indigo-500"
          >
            <option value="rating">Highest Rated</option>
            <option value="experience">Most Experienced</option>
            <option value="fee_low">Lowest Consultation Fee</option>
            <option value="newest">Newest Listed</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Filter Panel */}
        <div className="lg:col-span-4">
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Right Cards List */}
        <div className="lg:col-span-8 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-64 rounded-2xl bg-[var(--color-surface-alt)] animate-pulse border border-[var(--color-border-light)]"
                />
              ))}
            </div>
          ) : displayedList.length === 0 ? (
            /* Empty State */
            <div className="rounded-3xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                <Building size={32} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--color-text)]">
                  No advocates found matching your criteria
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-1 max-w-sm mx-auto">
                  Try broadening your location search, resetting practice area filters, or searching nearby states.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 text-xs font-semibold transition-all"
              >
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {displayedList.map((advocate) => (
                <AdvocateCard
                  key={advocate._id}
                  advocate={advocate}
                  isFavoriteInitial={favorites.includes(advocate._id)}
                  onFavoriteToggle={(id, isFav) => {
                    setFavorites((prev) =>
                      isFav ? [...prev, id] : prev.filter((f) => f !== id)
                    )
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
