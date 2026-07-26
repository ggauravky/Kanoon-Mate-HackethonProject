import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, Tag, AlertCircle, Plus, Check } from 'lucide-react'

export default function AddReminderModal({ isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Reply Deadline')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('medium')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!title.trim() || !dueDate) {
      setError('Please provide both a title and due date.')
      return
    }

    setLoading(true)
    try {
      await onSave({
        title,
        category,
        dueDate,
        priority,
        description,
      })
      setTitle('')
      setDueDate('')
      setDescription('')
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to save reminder.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100"
        >
          {/* Header */}
          <div className="bg-slate-900 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full p-1 text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-2 mb-1 text-indigo-400">
              <Calendar size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Deadline Tracker</span>
            </div>
            <h3 className="text-xl font-bold">Add Legal Reminder</h3>
            <p className="text-xs text-slate-400 mt-1">Track hearing dates, reply deadlines, or filing due dates</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                <AlertCircle size={16} className="shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Reminder Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Reply to Consumer Forum Notice"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-xs text-slate-800 focus:bg-white focus:border-indigo-500 outline-none transition-all"
                >
                  <option value="Reply Deadline">Reply Deadline</option>
                  <option value="Hearing">Hearing Date</option>
                  <option value="Filing Date">Filing Date</option>
                  <option value="Payment Due">Payment Due</option>
                  <option value="Renewal">Renewal Date</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs text-slate-800 focus:bg-white focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['low', 'medium', 'high'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-1.5 px-2 text-xs font-bold rounded-xl border text-center uppercase transition-all ${
                      priority === p
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Notes & Instructions (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Add relevant case numbers, court room details, or reply notes…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3.5 text-xs text-slate-800 focus:bg-white focus:border-indigo-500 outline-none transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 text-xs sm:text-sm shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Plus size={16} />
                  <span>Save Reminder</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
