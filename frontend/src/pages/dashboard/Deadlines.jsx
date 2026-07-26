import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  CalendarClock,
  Plus,
  Calendar,
  ListFilter,
  AlertCircle,
  Clock,
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import TimelineView from '../../components/deadlines/TimelineView'
import CalendarView from '../../components/deadlines/CalendarView'
import AddReminderModal from '../../components/deadlines/AddReminderModal'
import { remindersAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function Deadlines() {
  const [activeTab, setActiveTab] = useState('timeline') // 'timeline' | 'calendar'
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('pending')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchReminders = () => {
    setLoading(true)
    remindersAPI
      .getReminders()
      .then((res) => {
        const fetched = res.data?.data?.reminders || []
        setReminders(fetched)
      })
      .catch((err) => {
        toast.error('Failed to load deadline reminders.')
        setReminders([])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchReminders()
  }, [])

  const handleCreateReminder = async (formData) => {
    try {
      const res = await remindersAPI.createReminder(formData)
      const newReminder = res.data?.data?.reminder
      if (newReminder) {
        setReminders((prev) => [newReminder, ...prev])
      } else {
        await fetchReminders()
      }
      toast.success('Deadline reminder created successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to create reminder.')
    }
  }

  const handleToggleStatus = async (id, newStatus) => {
    try {
      await remindersAPI.updateReminder(id, { status: newStatus })
      setReminders((prev) =>
        prev.map((r) => ((r._id || r.id) === id ? { ...r, status: newStatus } : r))
      )
      toast.success(`Status updated to ${newStatus}`)
    } catch (err) {
      toast.error(err.message || 'Failed to update reminder status.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this deadline reminder?')) return

    try {
      await remindersAPI.deleteReminder(id)
      setReminders((prev) => prev.filter((r) => (r._id || r.id) !== id))
      toast.success('Reminder deleted successfully.')
    } catch (err) {
      toast.error(err.message || 'Failed to delete reminder.')
    }
  }

  const filteredReminders = reminders.filter((r) => {
    const matchesCategory = categoryFilter === 'All' || r.category === categoryFilter
    const matchesStatus = statusFilter === 'All' || (statusFilter === 'pending' ? r.status !== 'completed' : r.status === statusFilter)
    return matchesCategory && matchesStatus
  })

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header with CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Deadline Tracking & Reminders"
          subtitle="Automatically extracted court dates, reply windows, and statutory filing deadlines."
        />

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-4 py-2.5 text-xs shadow-md shadow-indigo-600/30 transition-all shrink-0 self-start sm:self-center cursor-pointer"
        >
          <Plus size={16} /> Add Legal Deadline
        </button>
      </div>

      {/* Controls Bar: View Tabs & Category Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl w-full md:w-auto">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'timeline'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListFilter size={15} /> Timeline View
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar size={15} /> Calendar View
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {['All', 'Reply Deadline', 'Hearing', 'Filing Date', 'Payment Due'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* View Rendering */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : activeTab === 'timeline' ? (
        <TimelineView
          reminders={filteredReminders}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      ) : (
        <CalendarView reminders={filteredReminders} />
      )}

      {/* Add Reminder Modal */}
      <AddReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateReminder}
      />
    </div>
  )
}
