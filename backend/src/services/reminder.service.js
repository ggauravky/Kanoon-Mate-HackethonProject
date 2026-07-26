import Reminder from '../models/reminder.model.js'

/**
 * Service: Create a new deadline reminder
 */
export const createReminderService = async (data, userId) => {
  if (!data.title || !data.dueDate) {
    const error = new Error('Title and due date are required for a reminder')
    error.statusCode = 400
    throw error
  }

  const newReminder = await Reminder.create({
    title: data.title,
    description: data.description || '',
    category: data.category || 'Reply Deadline',
    dueDate: new Date(data.dueDate),
    priority: data.priority || 'medium',
    status: data.status || 'pending',
    documentId: data.documentId || null,
    userId,
    extractedFromAI: data.extractedFromAI || false,
  })

  return newReminder
}

/**
 * Service: Get all reminders for a logged-in user
 */
export const getUserRemindersService = async (userId, query = {}) => {
  const filter = { userId }

  if (query.status) {
    filter.status = query.status
  }
  if (query.category) {
    filter.category = query.category
  }

  const reminders = await Reminder.find(filter)
    .populate('documentId', 'title originalFileName')
    .sort({ dueDate: 1 })

  return reminders
}

/**
 * Service: Get single reminder by ID with ownership check
 */
export const getReminderByIdService = async (reminderId, userId) => {
  const reminder = await Reminder.findById(reminderId).populate('documentId', 'title originalFileName')

  if (!reminder) {
    const error = new Error('Reminder not found')
    error.statusCode = 404
    throw error
  }

  if (reminder.userId.toString() !== userId.toString()) {
    const error = new Error('Access denied. You do not own this reminder.')
    error.statusCode = 403
    throw error
  }

  return reminder
}

/**
 * Service: Update reminder details or completion status
 */
export const updateReminderService = async (reminderId, userId, updateData) => {
  const reminder = await getReminderByIdService(reminderId, userId)

  if (updateData.title) reminder.title = updateData.title
  if (updateData.description !== undefined) reminder.description = updateData.description
  if (updateData.category) reminder.category = updateData.category
  if (updateData.dueDate) reminder.dueDate = new Date(updateData.dueDate)
  if (updateData.priority) reminder.priority = updateData.priority
  if (updateData.status) reminder.status = updateData.status

  await reminder.save()
  return reminder
}

/**
 * Service: Delete a reminder
 */
export const deleteReminderService = async (reminderId, userId) => {
  await getReminderByIdService(reminderId, userId)
  await Reminder.findByIdAndDelete(reminderId)
  return { id: reminderId }
}
