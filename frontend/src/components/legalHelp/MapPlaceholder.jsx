import { MapPin, Navigation, ExternalLink } from 'lucide-react'

export default function MapPlaceholder({ name, address, city, state, latitude, longitude }) {
  const fullAddress = `${address ? address + ', ' : ''}${city || ''}, ${state || ''}`
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    fullAddress || name
  )}`

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-900 text-white p-6 space-y-4 shadow-sm relative overflow-hidden">
      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MapPin className="text-indigo-400" size={18} />
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Location Coordinates & Map Directions
            </h4>
          </div>
          <p className="text-sm font-bold text-white line-clamp-1">{name}</p>
          <p className="text-xs text-slate-400">{fullAddress}</p>
        </div>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 text-xs font-bold shadow-xs transition-colors"
        >
          <Navigation size={15} />
          <span>Get Directions</span>
          <ExternalLink size={13} />
        </a>
      </div>

      {/* Map Graphic Canvas Simulation */}
      <div className="relative z-10 rounded-2xl border border-slate-700 bg-slate-800/80 p-8 text-center space-y-3 min-h-[160px] flex flex-col items-center justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 animate-bounce">
          <MapPin size={24} />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-200">
            Interactive Maps Integration Ready
          </p>
          <p className="text-[11px] text-slate-400">
            GPS Coordinates: {latitude || '28.6139'}° N, {longitude || '77.2090'}° E
          </p>
        </div>
      </div>
    </div>
  )
}
