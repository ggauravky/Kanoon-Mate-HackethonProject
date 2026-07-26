import Document from '../models/document.model.js'
import Reminder from '../models/reminder.model.js'
import Notification from '../models/notification.model.js'
import Report from '../models/report.model.js'
import mongoose from 'mongoose'

// Fallback User Model accessor in case User model is loaded dynamically
const getUserModel = () => {
  return mongoose.models.User || mongoose.model('User')
}

/**
 * Service: Aggregate high-performance admin dashboard metrics & real MongoDB chart data
 */
export const getAdminAnalyticsService = async () => {
  const User = getUserModel()

  const [
    totalUsers,
    activeUsers,
    totalDocuments,
    aiAnalyses,
    failedOCR,
    totalDeadlines,
    reportsGenerated,
    totalNotifications,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isVerified: true }),
    Document.countDocuments(),
    Document.countDocuments({ uploadStatus: 'analyzed' }),
    Document.countDocuments({ uploadStatus: 'failed' }),
    Reminder.countDocuments(),
    Report.countDocuments(),
    Notification.countDocuments(),
  ])

  // Daily uploads in the last 7 days aggregated from MongoDB
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const dailyUploadsRaw = await Document.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $dayOfWeek: '$createdAt' },
        uploads: { $sum: 1 },
        aiProcessed: {
          $sum: { $cond: [{ $eq: ['$uploadStatus', 'analyzed'] }, 1, 0] },
        },
      },
    },
    { $sort: { '_id': 1 } },
  ])

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dailyUploadsMap = new Map()
  dailyUploadsRaw.forEach((item) => {
    const dayName = dayNames[(item._id - 1) % 7]
    dailyUploadsMap.set(dayName, item)
  })

  const dailyUploads = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
    const found = dailyUploadsMap.get(day)
    return {
      day,
      uploads: found ? found.uploads : 0,
      aiProcessed: found ? found.aiProcessed : 0,
    }
  })

  // Category & Document Type distribution from MongoDB
  const categoryRaw = await Document.aggregate([
    { $group: { _id: '$analysis.documentType', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ])

  const aiUsageByCategory = categoryRaw.map((c) => ({
    category: c._id || 'General Legal Document',
    count: c.count,
  }))

  const colors = ['#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#64748B']
  const documentTypesDistribution = categoryRaw.map((c, i) => ({
    name: c._id || 'Other Documents',
    value: c.count,
    color: colors[i % colors.length],
  }))

  // Monthly growth aggregation from MongoDB
  const monthlyUsers = await User.aggregate([
    {
      $group: {
        _id: { month: { $month: '$createdAt' } },
        users: { $sum: 1 },
      },
    },
    { $sort: { '_id.month': 1 } },
  ])

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const monthlyGrowth = monthlyUsers.map((m) => ({
    month: monthNames[(m._id.month - 1) % 12],
    users: m.users,
    docs: totalDocuments,
  }))

  return {
    overview: {
      totalUsers,
      activeUsers,
      totalDocuments,
      aiAnalyses,
      failedOCR,
      totalDeadlines,
      reportsGenerated,
      totalNotifications,
    },
    charts: {
      dailyUploads,
      aiUsageByCategory,
      documentTypesDistribution,
      monthlyGrowth,
    },
  }
}

/**
 * Service: Get paginated list of registered users for Admin panel
 */
export const getAllUsersService = async (query = {}) => {
  const User = getUserModel()
  const filter = {}

  if (query.search) {
    filter.$or = [
      { fullName: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
    ]
  }
  if (query.role) {
    filter.role = query.role
  }

  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })

  return users
}

/**
 * Service: Update user role or verification status
 */
export const updateUserService = async (userId, updateData) => {
  const User = getUserModel()
  const user = await User.findById(userId)

  if (!user) {
    const error = new Error('User not found')
    error.statusCode = 404
    throw error
  }

  if (updateData.role) user.role = updateData.role
  if (updateData.isVerified !== undefined) user.isVerified = updateData.isVerified

  await user.save()
  return user
}

/**
 * Service: Delete user account
 */
export const deleteUserService = async (userId) => {
  const User = getUserModel()
  await User.findByIdAndDelete(userId)
  return { id: userId }
}

/**
 * Service: Broadcast system alert notification to all users
 */
export const broadcastNotificationService = async ({ title, message, priority = 'Medium' }) => {
  const User = getUserModel()
  const allUsers = await User.find({}).select('_id')

  const notifications = allUsers.map((u) => ({
    user: u._id,
    title,
    message,
    type: 'System Alert',
    priority,
    isRead: false,
  }))

  if (notifications.length > 0) {
    await Notification.insertMany(notifications)
  }

  return { broadcastCount: notifications.length }
}
