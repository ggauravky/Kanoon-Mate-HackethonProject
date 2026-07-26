import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { mockStats } from '../../data/mockData'
import StatCard from '../../components/common/StatCard'
import SectionCard from '../../components/common/SectionCard'
import QuickActions from '../../components/widgets/QuickActions'
import RecentDocuments from '../../components/widgets/RecentDocuments'
import DeadlinesWidget from '../../components/widgets/DeadlinesWidget'
import LegalTips from '../../components/widgets/LegalTips'

export default function DashboardHome() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const firstName = user?.name?.split(' ')[0] ?? 'there'

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* ── Welcome Card ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 60%, var(--color-secondary) 100%)',
        }}
      >
        {/* Background decoration */}
        <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-white/5" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-blue-200 mb-1">Welcome back</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Hello, {firstName} 👋
            </h1>
            <p className="mt-2 text-blue-100 text-sm max-w-sm">
              Ready to simplify your legal documents? Let AI do the heavy lifting.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/dashboard/upload')}
            className="flex items-center gap-2 self-start sm:self-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-primary)] shadow-lg hover:shadow-xl transition-shadow shrink-0"
            id="welcome-upload-btn"
          >
            Upload Document
            <ArrowRight size={16} />
          </motion.button>
        </div>
      </motion.div>

      {/* ── Quick Actions ─────────────────────────────────────────────────── */}
      <SectionCard title="Quick Actions">
        <QuickActions />
      </SectionCard>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {mockStats.map((stat, i) => (
          <StatCard key={stat.id} {...stat} index={i} />
        ))}
      </div>

      {/* ── Recent Documents ──────────────────────────────────────────────── */}
      <SectionCard
        title="Recent Documents"
        noPad
        action={
          <button
            onClick={() => navigate('/dashboard/documents')}
            className="btn-ghost text-xs gap-1 text-[var(--color-primary)]"
            id="view-all-docs-btn"
          >
            View All <ArrowRight size={13} />
          </button>
        }
      >
        <RecentDocuments limit={5} />
      </SectionCard>

      {/* ── Bottom Row: Deadlines + Tips ──────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        {/* Deadlines */}
        <SectionCard
          title="Upcoming Deadlines"
          action={
            <button
              onClick={() => navigate('/dashboard/deadlines')}
              className="btn-ghost text-xs gap-1 text-[var(--color-primary)]"
              id="view-all-deadlines-btn"
            >
              View All <ArrowRight size={13} />
            </button>
          }
        >
          <DeadlinesWidget limit={3} />
        </SectionCard>

        {/* Legal Tips */}
        <SectionCard title="Legal Awareness">
          <LegalTips />
        </SectionCard>
      </div>
    </div>
  )
}
