import {
  getUserNotificationsService,
  markAsReadService,
  markAllAsReadService,
  deleteNotificationService,
} from '../services/notification.service.js'

/**
 * @desc    Get user's notifications & unread count
 * @route   GET /api/v1/notifications
 * @access  Private
 */
export const getUserNotifications = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id
    const { notifications, unreadCount } = await getUserNotificationsService(userId, req.query)

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: { notifications, unreadCount },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Mark single notification as read
 * @route   PATCH /api/v1/notifications/:id/read
 * @access  Private
 */
export const markAsRead = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id
    const notification = await markAsReadService(req.params.id, userId)

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: { notification },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Mark all user notifications as read
 * @route   PATCH /api/v1/notifications/read-all
 * @access  Private
 */
export const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id
    await markAllAsReadService(userId)

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Delete notification
 * @route   DELETE /api/v1/notifications/:id
 * @access  Private
 */
export const deleteNotification = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id
    await deleteNotificationService(req.params.id, userId)

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
      data: { id: req.params.id },
    })
  } catch (error) {
    next(error)
  }
}
