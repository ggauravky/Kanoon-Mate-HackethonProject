import { Router } from 'express'
import { protect } from '../middleware/auth.middleware.js'
import {
  createReminder,
  getUserReminders,
  getReminderById,
  updateReminder,
  deleteReminder,
} from '../controllers/reminder.controller.js'

const router = Router()

// Protect all reminder endpoints
router.use(protect)

// POST /api/v1/reminders - Create deadline reminder
router.post('/', createReminder)

// GET /api/v1/reminders - List user's reminders
router.get('/', getUserReminders)

// GET /api/v1/reminders/:id - Get single reminder details
router.get('/:id', getReminderById)

// PATCH /api/v1/reminders/:id - Update reminder
router.patch('/:id', updateReminder)

// DELETE /api/v1/reminders/:id - Delete reminder
router.delete('/:id', deleteReminder)

export default router
