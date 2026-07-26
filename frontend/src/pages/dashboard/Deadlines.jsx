import PageHeader from '../../components/common/PageHeader'
import SectionCard from '../../components/common/SectionCard'
import DeadlinesWidget from '../../components/widgets/DeadlinesWidget'
import { mockDeadlines } from '../../data/mockData'
import { Plus } from 'lucide-react'

export default function Deadlines() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Deadlines"
        subtitle="Track and manage all your upcoming legal deadlines."
        action={
          <button className="btn-primary gap-1.5" id="add-deadline-btn">
            <Plus size={14} /> Add Deadline
          </button>
        }
      />

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total', value: mockDeadlines.length, color: 'text-[var(--color-primary)]' },
          { label: 'Urgent', value: mockDeadlines.filter(d => d.status === 'Urgent').length, color: 'text-[var(--color-danger)]' },
          { label: 'Upcoming', value: mockDeadlines.filter(d => d.status === 'Upcoming').length, color: 'text-[var(--color-warning)]' },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <SectionCard title="All Deadlines">
        <DeadlinesWidget limit={mockDeadlines.length} />
      </SectionCard>
    </div>
  )
}
