import {
  createReminderService,
  getUserRemindersService,
  getReminderByIdService,
  updateReminderService,
  deleteReminderService,
} from '../services/reminder.service.js'

/**
 * @desc    Create new deadline reminder
 * @route   POST /api/v1/reminders
 * @access  Private
 */
export const createReminder = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id
    const reminder = await createReminderService(req.body, userId)

    res.status(201).json({
      success: true,
      message: 'Deadline reminder created successfully',
      data: { reminder },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get user's deadline reminders
 * @route   GET /api/v1/reminders
 * @access  Private
 */
export const getUserReminders = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id
    const reminders = await getUserRemindersService(userId, req.query)

    res.status(200).json({
      success: true,
      count: reminders.length,
      data: { reminders },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get single reminder details
 * @route   GET /api/v1/reminders/:id
 * @access  Private
 */
export const getReminderById = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id
    const reminder = await getReminderByIdService(req.params.id, userId)

    res.status(200).json({
      success: true,
      data: { reminder },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Update reminder details or status
 * @route   PATCH /api/v1/reminders/:id
 * @access  Private
 */
export const updateReminder = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id
    const reminder = await updateReminderService(req.params.id, userId, req.body)

    res.status(200).json({
      success: true,
      message: 'Reminder updated successfully',
      data: { reminder },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Delete reminder
 * @route   DELETE /api/v1/reminders/:id
 * @access  Private
 */
export const deleteReminder = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id
    await deleteReminderService(req.params.id, userId)

    res.status(200).json({
      success: true,
      message: 'Reminder deleted successfully',
      data: { id: req.params.id },
    })
  } catch (error) {
    next(error)
  }
}
