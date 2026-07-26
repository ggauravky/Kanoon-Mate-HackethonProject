import { motion } from 'framer-motion'
import { Mail, Phone, Shield, Edit2, Camera } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import SectionCard from '../../components/common/SectionCard'
import { useAuth } from '../../context/AuthContext'

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-[var(--color-border-light)] last:border-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-50)]">
        <Icon size={14} className="text-[var(--color-primary)]" />
      </div>
      <div>
        <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
        <p className="text-sm font-medium text-[var(--color-text)] mt-0.5">{value}</p>
      </div>
    </div>
  )
}

export default function Profile() {
  const { user } = useAuth()
  const initials = user?.name?.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() ?? 'U'

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <PageHeader
        title="My Profile"
        subtitle="View and manage your personal information."
        action={
          <button className="btn-primary gap-1.5" id="edit-profile-btn">
            <Edit2 size={14} /> Edit Profile
          </button>
        }
      />

      {/* Avatar Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="card p-6 flex flex-col items-center text-center gap-3"
      >
        {/* Avatar */}
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-2xl font-bold text-white shadow-lg">
            {initials}
          </div>
          <button
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] shadow hover:bg-[var(--color-surface-alt)] transition-colors"
            id="change-avatar-btn"
            aria-label="Change avatar"
          >
            <Camera size={13} className="text-[var(--color-text-secondary)]" />
          </button>
        </div>

        <div>
          <h2 className="text-lg font-bold text-[var(--color-text)]">{user?.name}</h2>
          <p className="text-sm text-[var(--color-text-muted)]">{user?.role}</p>
        </div>

        <span className="badge badge-green text-xs px-3 py-1">{user?.plan} Plan</span>
      </motion.div>

      {/* Contact Info */}
      <SectionCard title="Contact Information">
        <InfoRow icon={Mail} label="Email Address" value={user?.email ?? '—'} />
        <InfoRow icon={Phone} label="Phone Number" value={user?.phone ?? '—'} />
      </SectionCard>

      {/* Account Info */}
      <SectionCard title="Account Details">
        <InfoRow icon={Shield} label="Account Type" value={user?.role ?? 'Individual'} />
        <InfoRow
          icon={Shield}
          label="Member Since"
          value={user?.joinedAt
            ? new Date(user.joinedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
            : '—'}
        />
      </SectionCard>
    </div>
  )
}
