import {
  getAdminAnalyticsService,
  getAllUsersService,
  updateUserService,
  deleteUserService,
  broadcastNotificationService,
} from '../services/admin.service.js'

/**
 * @desc    Get complete admin dashboard analytics & charts
 * @route   GET /api/v1/admin/analytics
 * @access  Private (Admin Only)
 */
export const getAdminAnalytics = async (req, res, next) => {
  try {
    const analytics = await getAdminAnalyticsService()

    res.status(200).json({
      success: true,
      data: analytics,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get all users list with search & role filters
 * @route   GET /api/v1/admin/users
 * @access  Private (Admin Only)
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService(req.query)

    res.status(200).json({
      success: true,
      count: users.length,
      data: { users },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Update user role or verification status
 * @route   PATCH /api/v1/admin/users/:id
 * @access  Private (Admin Only)
 */
export const updateUser = async (req, res, next) => {
  try {
    const user = await updateUserService(req.params.id, req.body)

    res.status(200).json({
      success: true,
      message: 'User account updated successfully',
      data: { user },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Delete user account
 * @route   DELETE /api/v1/admin/users/:id
 * @access  Private (Admin Only)
 */
export const deleteUser = async (req, res, next) => {
  try {
    await deleteUserService(req.params.id)

    res.status(200).json({
      success: true,
      message: 'User account deleted successfully',
      data: { id: req.params.id },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Broadcast system announcement notification to all users
 * @route   POST /api/v1/admin/notifications/broadcast
 * @access  Private (Admin Only)
 */
export const broadcastNotification = async (req, res, next) => {
  try {
    const result = await broadcastNotificationService(req.body)

    res.status(200).json({
      success: true,
      message: `System notification broadcasted to ${result.broadcastCount} users`,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}
