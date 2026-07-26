import { FileText, Search, Filter } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import SectionCard from '../../components/common/SectionCard'
import RecentDocuments from '../../components/widgets/RecentDocuments'

export default function Documents() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="My Documents"
        subtitle="All your uploaded legal documents in one place."
        action={
          <div className="flex items-center gap-2">
            <button className="btn-ghost gap-1.5 border border-[var(--color-border)]" id="filter-docs-btn">
              <Filter size={14} /> Filter
            </button>
            <button className="btn-primary gap-1.5" id="upload-from-docs-btn">
              <FileText size={14} /> Upload New
            </button>
          </div>
        }
      />

      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
        <input
          type="text"
          placeholder="Search documents…"
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-2 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          id="docs-search-input"
        />
      </div>

      <SectionCard title="All Documents" noPad>
        <RecentDocuments limit={20} />
      </SectionCard>
    </div>
  )
}
