import { Router } from 'express'
import { protect } from '../middleware/auth.middleware.js'
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../controllers/notification.controller.js'

const router = Router()

// Protect all notification routes
router.use(protect)

// GET /api/v1/notifications - Get all notifications & unread count
router.get('/', getUserNotifications)

// PATCH /api/v1/notifications/read-all - Mark all user notifications as read
router.patch('/read-all', markAllAsRead)

// PATCH /api/v1/notifications/:id/read - Mark single notification as read
router.patch('/:id/read', markAsRead)

// DELETE /api/v1/notifications/:id - Delete notification
router.delete('/:id', deleteNotification)

export default router
