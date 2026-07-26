import { Bell, Lock, Eye, Globe, Trash2 } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import SectionCard from '../../components/common/SectionCard'

function SettingsRow({ label, description, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-[var(--color-border-light)] last:border-0">
      <div>
        <p className="text-sm font-medium text-[var(--color-text)]">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ defaultChecked = false }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
      <div className="h-5 w-9 rounded-full bg-[var(--color-border)] transition-colors peer-checked:bg-[var(--color-primary)] after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow after:transition-all peer-checked:after:translate-x-4" />
    </label>
  )
}

export default function Settings() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <PageHeader
        title="Settings"
        subtitle="Manage your account preferences and application settings."
      />

      {/* Notifications */}
      <SectionCard>
        <div className="flex items-center gap-2 mb-2">
          <Bell size={16} className="text-[var(--color-primary)]" />
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Notifications</h2>
        </div>
        <SettingsRow label="Email Notifications" description="Receive deadline reminders via email">
          <Toggle defaultChecked />
        </SettingsRow>
        <SettingsRow label="Push Notifications" description="Get browser push alerts">
          <Toggle />
        </SettingsRow>
        <SettingsRow label="Deadline Alerts" description="Alert 7 days before deadline">
          <Toggle defaultChecked />
        </SettingsRow>
      </SectionCard>

      {/* Privacy */}
      <SectionCard>
        <div className="flex items-center gap-2 mb-2">
          <Eye size={16} className="text-[var(--color-primary)]" />
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Privacy</h2>
        </div>
        <SettingsRow label="Share Usage Analytics" description="Help improve LawAssist AI">
          <Toggle />
        </SettingsRow>
        <SettingsRow label="Document Retention" description="Auto-delete documents after 1 year">
          <Toggle defaultChecked />
        </SettingsRow>
      </SectionCard>

      {/* Language */}
      <SectionCard>
        <div className="flex items-center gap-2 mb-3">
          <Globe size={16} className="text-[var(--color-primary)]" />
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Language & Region</h2>
        </div>
        <select
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          id="language-select"
          defaultValue="en"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="mr">Marathi</option>
          <option value="ta">Tamil</option>
          <option value="te">Telugu</option>
        </select>
      </SectionCard>

      {/* Security */}
      <SectionCard>
        <div className="flex items-center gap-2 mb-2">
          <Lock size={16} className="text-[var(--color-primary)]" />
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Security</h2>
        </div>
        <SettingsRow label="Two-Factor Authentication" description="Add an extra layer of security">
          <Toggle />
        </SettingsRow>
        <SettingsRow label="Change Password" description="Update your account password">
          <button className="btn-ghost text-xs border border-[var(--color-border)]" id="change-password-btn">Change</button>
        </SettingsRow>
      </SectionCard>

      {/* Danger Zone */}
      <SectionCard>
        <div className="flex items-center gap-2 mb-2">
          <Trash2 size={16} className="text-[var(--color-danger)]" />
          <h2 className="text-sm font-semibold text-[var(--color-danger)]">Danger Zone</h2>
        </div>
        <SettingsRow label="Delete Account" description="Permanently delete your account and all data.">
          <button className="rounded-lg border border-[var(--color-danger)] px-3 py-1.5 text-xs font-medium text-[var(--color-danger)] hover:bg-[var(--color-danger-50)] transition-colors" id="delete-account-btn">
            Delete
          </button>
        </SettingsRow>
      </SectionCard>
    </div>
  )
}
