import { Router } from 'express'
import { protect } from '../middleware/auth.middleware.js'
import { authorizeAdmin } from '../middleware/admin.middleware.js'
import {
  getAdminAnalytics,
  getAllUsers,
  updateUser,
  deleteUser,
  broadcastNotification,
} from '../controllers/admin.controller.js'

const router = Router()

// Protect all admin routes with JWT Auth & Admin RBAC
router.use(protect)
router.use(authorizeAdmin)

// GET /api/v1/admin/analytics - Platform performance & chart metrics
router.get('/analytics', getAdminAnalytics)

// GET /api/v1/admin/users - User management list with filters
router.get('/users', getAllUsers)

// PATCH /api/v1/admin/users/:id - Update user role / verification
router.patch('/users/:id', updateUser)

// DELETE /api/v1/admin/users/:id - Delete user account
router.delete('/users/:id', deleteUser)

// POST /api/v1/admin/notifications/broadcast - Send announcement to all users
router.post('/notifications/broadcast', broadcastNotification)

export default router
