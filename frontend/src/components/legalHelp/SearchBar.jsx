import { Search, MapPin, Filter, X } from 'lucide-react'

export default function SearchBar({
  search,
  setSearch,
  selectedType,
  setSelectedType,
  selectedCity,
  setSelectedCity,
  serviceTypes,
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search Query Input */}
        <div className="relative md:col-span-6">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by advocate name, DLSA, helpline, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-9 py-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* City Input */}
        <div className="relative md:col-span-3">
          <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-500" />
          <input
            type="text"
            placeholder="City / State (e.g. Delhi, Mumbai)"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        {/* Service Type Dropdown */}
        <div className="relative md:col-span-3">
          <Filter size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 appearance-none cursor-pointer"
          >
            <option value="">All Service Types</option>
            {serviceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
