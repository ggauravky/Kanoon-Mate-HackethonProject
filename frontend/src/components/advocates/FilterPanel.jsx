import { ADVOCATE_PRACTICE_AREAS } from '../../../../backend/src/config/advocateMapping.js'
import { Filter, RotateCcw, Search, MapPin, Award, Star, Video, Building } from 'lucide-react'

// Client side practice area fallback list
const PRACTICE_AREAS = [
  'All Practice Areas',
  'Family Lawyer',
  'Criminal Lawyer',
  'Property Lawyer',
  'Corporate Lawyer',
  'Civil Lawyer',
  'Tax Lawyer',
  'Consumer Lawyer',
  'Cyber Crime Lawyer',
  'Employment Lawyer',
  'Startup Lawyer',
  'Trademark Lawyer',
  'Intellectual Property Lawyer',
  'Divorce Lawyer',
  'Banking Lawyer',
  'Real Estate Lawyer',
  'Labour Lawyer',
]

export default function FilterPanel({ filters, onFilterChange, onReset }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-surface)] p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-[var(--color-border-light)] pb-3">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-sm text-[var(--color-text)]">Filter Advocates</h3>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-medium"
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* Search Input */}
      <div>
        <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1">
          Search Advocates
        </label>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Name, practice area, city..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] py-2 pl-9 pr-3 text-xs text-[var(--color-text)] outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Practice Area Select */}
      <div>
        <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1">
          Practice Specialization
        </label>
        <select
          value={filters.practiceArea || ''}
          onChange={(e) => onFilterChange('practiceArea', e.target.value === 'All Practice Areas' ? '' : e.target.value)}
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] py-2 px-3 text-xs text-[var(--color-text)] outline-none focus:border-indigo-500"
        >
          {PRACTICE_AREAS.map((area) => (
            <option key={area} value={area === 'All Practice Areas' ? '' : area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      {/* Location City Input */}
      <div>
        <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1">
          City / Location
        </label>
        <div className="relative">
          <MapPin size={15} className="absolute left-3 top-2.5 text-rose-500" />
          <input
            type="text"
            placeholder="e.g. Delhi, Mumbai"
            value={filters.city || ''}
            onChange={(e) => onFilterChange('city', e.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] py-2 pl-9 pr-3 text-xs text-[var(--color-text)] outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Min Experience */}
      <div>
        <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1 flex items-center gap-1">
          <Award size={14} className="text-amber-500" /> Min Experience (Years)
        </label>
        <select
          value={filters.minExperience || ''}
          onChange={(e) => onFilterChange('minExperience', e.target.value)}
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] py-2 px-3 text-xs text-[var(--color-text)] outline-none focus:border-indigo-500"
        >
          <option value="">Any Experience</option>
          <option value="3">3+ Years</option>
          <option value="5">5+ Years</option>
          <option value="10">10+ Years</option>
          <option value="15">15+ Years</option>
        </select>
      </div>

      {/* Min Rating */}
      <div>
        <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1 flex items-center gap-1">
          <Star size={14} className="text-amber-400 fill-amber-400" /> Minimum Rating
        </label>
        <select
          value={filters.minRating || ''}
          onChange={(e) => onFilterChange('minRating', e.target.value)}
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] py-2 px-3 text-xs text-[var(--color-text)] outline-none focus:border-indigo-500"
        >
          <option value="">All Ratings</option>
          <option value="4.5">4.5 ★ & Above</option>
          <option value="4.8">4.8 ★ & Above</option>
        </select>
      </div>

      {/* Availability Checks */}
      <div className="space-y-2 pt-2 border-t border-[var(--color-border-light)]">
        <label className="block text-xs font-semibold text-[var(--color-text-muted)]">Consultation Mode</label>
        <label className="flex items-center gap-2 text-xs text-[var(--color-text)] cursor-pointer">
          <input
            type="checkbox"
            checked={filters.onlineAvailable === 'true'}
            onChange={(e) => onFilterChange('onlineAvailable', e.target.checked ? 'true' : '')}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="flex items-center gap-1">
            <Video size={13} className="text-emerald-500" /> Online Consultation
          </span>
        </label>
        <label className="flex items-center gap-2 text-xs text-[var(--color-text)] cursor-pointer">
          <input
            type="checkbox"
            checked={filters.offlineAvailable === 'true'}
            onChange={(e) => onFilterChange('offlineAvailable', e.target.checked ? 'true' : '')}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="flex items-center gap-1">
            <Building size={13} className="text-blue-500" /> Office Visit
          </span>
        </label>
      </div>
    </div>
  )
}
