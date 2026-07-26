import {
  getAdvocateDashboardService,
  getAdvocateProfileService,
  updateAdvocateProfileService,
  getAdvocateClientRequestsService,
  updateClientRequestStatusService,
  getAdvocateAnalyticsService,
} from '../services/advocateDashboard.service.js'

/**
 * @desc    Get Advocate Dashboard Home metrics & recent activity
 * @route   GET /api/v1/advocate/dashboard
 * @access  Private (Advocate only)
 */
export const getAdvocateDashboard = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id
    const data = await getAdvocateDashboardService(userId)

    return res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get current Advocate Profile details
 * @route   GET /api/v1/advocate/profile
 * @access  Private (Advocate only)
 */
export const getAdvocateProfile = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id
    const profile = await getAdvocateProfileService(userId)

    return res.status(200).json({
      success: true,
      data: { profile },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Update current Advocate Profile details
 * @route   PUT /api/v1/advocate/profile
 * @access  Private (Advocate only)
 */
export const updateAdvocateProfile = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id
    const profile = await updateAdvocateProfileService(userId, req.body)

    return res.status(200).json({
      success: true,
      message: 'Advocate profile updated successfully',
      data: { profile },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get Advocate Client Requests
 * @route   GET /api/v1/advocate/client-requests
 * @access  Private (Advocate only)
 */
export const getClientRequests = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id
    const requests = await getAdvocateClientRequestsService(userId, req.query)

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: { requests },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Accept or Decline a Client Request
 * @route   PATCH /api/v1/advocate/client-requests/:id
 * @access  Private (Advocate only)
 */
export const updateClientRequestStatus = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id
    const { id } = req.params
    const { status } = req.body

    const request = await updateClientRequestStatusService(userId, id, status)

    return res.status(200).json({
      success: true,
      message: `Request status updated to ${status}`,
      data: { request },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get Advocate Analytics Data
 * @route   GET /api/v1/advocate/analytics
 * @access  Private (Advocate only)
 */
export const getAdvocateAnalytics = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id
    const analytics = await getAdvocateAnalyticsService(userId)

    return res.status(200).json({
      success: true,
      data: { analytics },
    })
  } catch (error) {
    next(error)
  }
}
