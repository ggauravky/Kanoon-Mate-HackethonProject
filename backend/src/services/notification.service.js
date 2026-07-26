import Notification from '../models/notification.model.js'

/**
 * Service: Create a new notification (Reusable across services & cron engine)
 * Designed for future dispatchers (Email, Push, WhatsApp)
 */
export const createNotificationService = async ({
  userId,
  title,
  message,
  type = 'System Alert',
  priority = 'Medium',
  relatedDocument = null,
  relatedDeadline = null,
}) => {
  if (!userId || !title || !message) {
    throw new Error('User, title, and message are required to create a notification')
  }

  const notification = await Notification.create({
    user: userId,
    title,
    message,
    type,
    priority,
    relatedDocument,
    relatedDeadline,
    isRead: false,
  })

  // Hook point for future multi-channel dispatchers (Email / Push / WhatsApp)
  // dispatchNotificationMultiChannel(notification)

  return notification
}

/**
 * Service: Get all notifications for logged-in user with filters
 */
export const getUserNotificationsService = async (userId, query = {}) => {
  const filter = { user: userId }

  if (query.isRead !== undefined) {
    filter.isRead = query.isRead === 'true'
  }
  if (query.type) {
    filter.type = query.type
  }

  const notifications = await Notification.find(filter)
    .populate('relatedDocument', 'title originalFileName')
    .populate('relatedDeadline', 'title dueDate category')
    .sort({ createdAt: -1 })

  const unreadCount = await Notification.countDocuments({ user: userId, isRead: false })

  return { notifications, unreadCount }
}

/**
 * Service: Mark single notification as read
 */
export const markAsReadService = async (notificationId, userId) => {
  const notification = await Notification.findOne({ _id: notificationId, user: userId })

  if (!notification) {
    const error = new Error('Notification not found')
    error.statusCode = 404
    throw error
  }

  notification.isRead = true
  await notification.save()

  return notification
}

/**
 * Service: Mark all notifications as read for a user
 */
export const markAllAsReadService = async (userId) => {
  await Notification.updateMany({ user: userId, isRead: false }, { $set: { isRead: true } })
  return { success: true }
}

/**
 * Service: Delete a notification
 */
export const deleteNotificationService = async (notificationId, userId) => {
  const notification = await Notification.findOneAndDelete({ _id: notificationId, user: userId })

  if (!notification) {
    const error = new Error('Notification not found')
    error.statusCode = 404
    throw error
  }

  return { id: notificationId }
}
