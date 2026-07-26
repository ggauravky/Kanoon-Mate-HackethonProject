import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function AdminStatCard({ title, value, trend, icon: Icon, color = 'indigo' }) {
  const isPositive = trend >= 0

  const colorStyles = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    red: 'bg-red-50 text-red-600 border-red-100',
  }

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="rounded-3xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={`p-2.5 rounded-2xl border ${colorStyles[color] || colorStyles.indigo}`}>
          <Icon size={18} />
        </div>
      </div>

      <div className="flex items-baseline justify-between pt-1">
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{value}</h3>

        {trend !== undefined && (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
              isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
            }`}
          >
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {isPositive ? `+${trend}%` : `${trend}%`}
          </span>
        )}
      </div>
    </motion.div>
  )
}
