import cron from 'node-cron'
import Reminder from '../models/reminder.model.js'
import Notification from '../models/notification.model.js'
import { createNotificationService } from './notification.service.js'

/**
 * Service: Check legal deadlines and generate automated notifications
 * Triggers at 7 days, 3 days, 1 day, on due date, and when overdue.
 */
export const checkAndGenerateDeadlineNotifications = async () => {
  try {
    const activeReminders = await Reminder.find({ status: { $ne: 'completed' } })
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    for (const reminder of activeReminders) {
      if (!reminder.dueDate) continue

      const due = new Date(reminder.dueDate)
      due.setHours(0, 0, 0, 0)

      const diffTime = due.getTime() - now.getTime()
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      let priority = null
      let title = null
      let message = null
      let intervalKey = null

      if (daysRemaining === 7) {
        intervalKey = '7_DAYS_BEFORE'
        priority = 'Medium'
        title = `Deadline Reminder: 7 Days Remaining`
        message = `"${reminder.title}" is due in 7 days on ${due.toLocaleDateString('en-IN')}. Prepare required legal documents.`
      } else if (daysRemaining === 3) {
        intervalKey = '3_DAYS_BEFORE'
        priority = 'High'
        title = `⚠️ Urgent: 3 Days Left for ${reminder.title}`
        message = `Only 3 days remaining for "${reminder.title}". Ensure your response or court filing is ready.`
      } else if (daysRemaining === 1) {
        intervalKey = '1_DAY_BEFORE'
        priority = 'Critical'
        title = `🚨 Critical: Deadline Tomorrow!`
        message = `"${reminder.title}" is due tomorrow (${due.toLocaleDateString('en-IN')}). Immediate action required.`
      } else if (daysRemaining === 0) {
        intervalKey = 'DUE_TODAY'
        priority = 'Critical'
        title = `🔔 Legal Deadline Due Today!`
        message = `"${reminder.title}" is due today! Complete your required filing or submission immediately.`
      } else if (daysRemaining < 0 && reminder.status !== 'dismissed') {
        intervalKey = 'OVERDUE'
        priority = 'Critical'
        title = `🔴 Overdue Legal Deadline`
        message = `"${reminder.title}" was due on ${due.toLocaleDateString('en-IN')}. Please verify if extensions apply.`
      }

      if (intervalKey) {
        // Prevent duplicate notification for the same interval
        const existingNotif = await Notification.findOne({
          user: reminder.userId,
          relatedDeadline: reminder._id,
          title,
        })

        if (!existingNotif) {
          await createNotificationService({
            userId: reminder.userId,
            title,
            message,
            type: 'Deadline Reminder',
            priority,
            relatedDeadline: reminder._id,
            relatedDocument: reminder.documentId,
          })
        }
      }
    }
  } catch (err) {
    console.error('Reminder Cron Engine Error:', err.message)
  }
}

/**
 * Initialize Cron Job Scheduler
 * Runs daily at midnight (00:00) and executes initial check on server start
 */
export const initReminderCronJob = () => {
  console.log('⏰ Initializing Legal Deadline Reminder Cron Scheduler...')

  // Run initial check immediately on server start
  checkAndGenerateDeadlineNotifications()

  // Schedule cron job to run every day at midnight (00:00)
  cron.schedule('0 0 * * *', () => {
    console.log('⏰ Running daily legal deadline check cron job...')
    checkAndGenerateDeadlineNotifications()
  })
}
