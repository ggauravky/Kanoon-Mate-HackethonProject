import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  PhoneCall,
  MapPin,
  Globe,
  Mail,
  Star,
  ExternalLink,
  ShieldCheck,
  Building2,
  Users,
  Award,
  Filter,
  CheckCircle2,
  X,
  Heart,
  Bookmark,
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import SectionCard from '../../components/common/SectionCard'
import {
  emergencyHelplines,
  queryLegalResources,
  getFavoriteResourceIds,
  toggleFavoriteResource,
} from '../../services/legalHubService'
import toast from 'react-hot-toast'

export default function LegalHub() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [favorites, setFavorites] = useState(getFavoriteResourceIds)
  const [selectedResource, setSelectedResource] = useState(null)

  const resources = queryLegalResources({
    searchQuery: search,
    category: selectedCategory,
    onlyFavorites,
  })

  const handleToggleFavorite = (id, e) => {
    if (e) e.stopPropagation()
    const updated = toggleFavoriteResource(id)
    setFavorites(updated)
    const isFav = updated.includes(id)
    toast.success(isFav ? 'Added to saved bookmarks' : 'Removed from bookmarks')
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <PageHeader
        title="Legal Help & Resources Hub"
        subtitle="Access free government legal aid, verified human rights NGOs, pro-bono lawyers, and emergency helplines."
      />

      {/* ── Emergency Helplines Banner ───────────────────────────────────────── */}
      <SectionCard title="Emergency 24/7 National Legal Helplines">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {emergencyHelplines.map((item, i) => (
            <motion.a
              key={item.id}
              href={`tel:${item.number}`}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group card p-3.5 flex flex-col justify-between border-l-4 border-l-[var(--color-primary)] hover:border-[var(--color-primary)] hover:shadow-md transition-all text-left bg-gradient-to-br from-white to-[var(--color-primary-50)]"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary-dark)]">
                    {item.category}
                  </span>
                  <span className="badge badge-green text-[9px] px-1.5 py-0.5">{item.timing}</span>
                </div>
                <h4 className="text-xs font-bold text-[var(--color-text)] line-clamp-1">{item.name}</h4>
                <p className="mt-1 text-[11px] text-[var(--color-text-muted)] line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[var(--color-border-light)] flex items-center justify-between text-xs font-bold text-[var(--color-primary)]">
                <span className="flex items-center gap-1">
                  <PhoneCall size={13} className="animate-pulse" /> {item.number}
                </span>
                <span className="text-[10px] text-[var(--color-primary-dark)] underline group-hover:translate-x-0.5 transition-transform">
                  Call Now →
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </SectionCard>

      {/* ── Search & Filter Controls Bar ─────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 card p-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3 top-3 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search by name, city, or service (e.g. Rent, Consumer, Delhi)…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] py-2.5 pl-9 pr-3 text-xs text-[var(--color-text)] focus:bg-white focus:border-[var(--color-primary)] outline-none transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {[
            { id: 'All', label: 'All Resources' },
            { id: 'Government Legal Aid', label: 'Govt Legal Aid (SLSA)' },
            { id: 'Legal NGO', label: 'Legal NGOs' },
            { id: 'Pro Bono Lawyers', label: 'Pro-Bono Panel' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id)
                setOnlyFavorites(false)
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                selectedCategory === cat.id && !onlyFavorites
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-50)] text-[var(--color-primary-dark)] shadow-xs'
                  : 'border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]'
              }`}
            >
              {cat.label}
            </button>
          ))}

          {/* Favorites Filter */}
          <button
            onClick={() => setOnlyFavorites((prev) => !prev)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-all ${
              onlyFavorites
                ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-xs'
                : 'border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)]'
            }`}
          >
            <Bookmark size={13} className={onlyFavorites ? 'fill-amber-500 text-amber-500' : ''} />
            Bookmarks ({favorites.length})
          </button>
        </div>
      </div>

      {/* ── Resource Directory Grid ──────────────────────────────────────────── */}
      {resources.length === 0 ? (
        <div className="card p-12 text-center space-y-3">
          <Building2 size={40} className="mx-auto text-[var(--color-text-muted)]" />
          <h3 className="text-sm font-bold text-[var(--color-text)]">No Legal Aid Resources Found</h3>
          <p className="text-xs text-[var(--color-text-muted)] max-w-sm mx-auto">
            Try adjusting your search query or clear filters to view available institutions.
          </p>
          <button
            onClick={() => {
              setSearch('')
              setSelectedCategory('All')
              setOnlyFavorites(false)
            }}
            className="btn-primary text-xs mx-auto mt-2"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((item, index) => {
            const isFav = favorites.includes(item.id)
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ y: -3 }}
                onClick={() => setSelectedResource(item)}
                className="card p-5 cursor-pointer space-y-4 hover:border-[var(--color-primary)] hover:shadow-md transition-all flex flex-col justify-between relative"
              >
                <div className="space-y-3">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="badge badge-blue text-[10px] font-bold uppercase tracking-wider">
                      {item.category}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleToggleFavorite(item.id, e)}
                      className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-amber-500 transition-colors"
                      title={isFav ? 'Remove Bookmark' : 'Bookmark Resource'}
                    >
                      <Bookmark size={16} className={isFav ? 'fill-amber-500 text-amber-500' : ''} />
                    </button>
                  </div>

                  {/* Title & City */}
                  <div>
                    <h3 className="text-sm font-bold text-[var(--color-text)] line-clamp-1">{item.title}</h3>
                    <p className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] mt-1 font-medium">
                      <MapPin size={13} className="text-[var(--color-primary)] shrink-0" />
                      {item.city}, {item.state}
                    </p>
                  </div>

                  {/* Services Badges */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.services.slice(0, 3).map((srv, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-[var(--color-surface-alt)] border border-[var(--color-border-light)] text-[10px] font-medium text-[var(--color-text-secondary)]"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div className="pt-3 border-t border-[var(--color-border-light)] flex items-center justify-between text-xs mt-4">
                  <a
                    href={`tel:${item.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 font-bold text-[var(--color-primary)] hover:underline"
                  >
                    <PhoneCall size={13} /> {item.phone.split(',')[0]}
                  </a>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedResource(item)
                    }}
                    className="btn-ghost py-1 px-2.5 text-xs text-[var(--color-primary-dark)] font-semibold"
                  >
                    View Details →
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* ── Resource Details Modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="card max-w-xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-[var(--color-border-light)] pb-4">
                <div className="space-y-1">
                  <span className="badge badge-blue text-[10px] font-bold uppercase tracking-wider">
                    {selectedResource.category}
                  </span>
                  <h2 className="text-base font-bold text-[var(--color-text)]">{selectedResource.title}</h2>
                  <p className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] font-medium">
                    <MapPin size={13} className="text-[var(--color-primary)] shrink-0" />
                    {selectedResource.address}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedResource(null)}
                  className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Services Offered */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[var(--color-text)] uppercase tracking-wider">
                  Services Provided
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedResource.services.map((srv, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--color-primary-50)] text-xs font-semibold text-[var(--color-primary-dark)]"
                    >
                      <CheckCircle2 size={14} className="text-[var(--color-primary)] shrink-0" />
                      <span>{srv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Free Legal Aid Eligibility */}
              <div className="space-y-1.5 p-3.5 rounded-xl bg-[var(--color-accent-50)] border border-[var(--color-accent-100)]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-accent-dark)]">
                  <ShieldCheck size={15} /> Eligibility for Free Representation
                </div>
                <p className="text-xs text-[var(--color-accent-dark)] leading-relaxed font-medium">
                  {selectedResource.eligibility}
                </p>
              </div>

              {/* Contact Information Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                <a
                  href={`tel:${selectedResource.phone}`}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-surface-alt)] hover:border-[var(--color-primary)] transition-all text-center"
                >
                  <PhoneCall size={16} className="text-[var(--color-primary)] mb-1" />
                  <span className="text-[10px] text-[var(--color-text-muted)]">Phone</span>
                  <span className="text-xs font-bold text-[var(--color-text)] truncate w-full">
                    {selectedResource.phone.split(',')[0]}
                  </span>
                </a>

                <a
                  href={`mailto:${selectedResource.email}`}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-surface-alt)] hover:border-[var(--color-primary)] transition-all text-center"
                >
                  <Mail size={16} className="text-[var(--color-primary)] mb-1" />
                  <span className="text-[10px] text-[var(--color-text-muted)]">Email</span>
                  <span className="text-xs font-bold text-[var(--color-text)] truncate w-full">
                    {selectedResource.email}
                  </span>
                </a>

                <a
                  href={selectedResource.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-surface-alt)] hover:border-[var(--color-primary)] transition-all text-center"
                >
                  <Globe size={16} className="text-[var(--color-primary)] mb-1" />
                  <span className="text-[10px] text-[var(--color-text-muted)]">Website</span>
                  <span className="text-xs font-bold text-[var(--color-primary)] flex items-center gap-1">
                    Visit Site <ExternalLink size={10} />
                  </span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
