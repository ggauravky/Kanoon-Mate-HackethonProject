import mongoose from 'mongoose'

const reminderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Reminder title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      enum: ['Hearing', 'Reply Deadline', 'Filing Date', 'Payment Due', 'Renewal', 'General'],
      default: 'Reply Deadline',
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'dismissed'],
      default: 'pending',
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    extractedFromAI: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// ─── Indexes ────────────────────────────────────────────────────────────────
reminderSchema.index({ userId: 1, status: 1, dueDate: 1 })

// ─── Virtual: Days Remaining Calculation ───────────────────────────────────────
reminderSchema.virtual('daysRemaining').get(function () {
  if (!this.dueDate) return 0
  const now = new Date()
  const due = new Date(this.dueDate)
  const diffTime = due.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// ─── Virtual: Urgency Color Code Status ────────────────────────────────────────
// Green (7+ days), Yellow (3-7 days), Red (< 3 days), Expired (Gray)
reminderSchema.virtual('urgencyCode').get(function () {
  const days = this.daysRemaining
  if (days < 0) return 'expired' // Gray
  if (days <= 3) return 'urgent' // Red
  if (days <= 7) return 'warning' // Yellow
  return 'normal' // Green
})

const Reminder = mongoose.model('Reminder', reminderSchema)

export default Reminder
