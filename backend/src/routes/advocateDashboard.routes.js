import { Router } from 'express'
import { protect, authorize } from '../middleware/auth.middleware.js'
import {
  getAdvocateDashboard,
  getAdvocateProfile,
  updateAdvocateProfile,
  getClientRequests,
  updateClientRequestStatus,
  getAdvocateAnalytics,
} from '../controllers/advocateDashboard.controller.js'

const router = Router()

// Protect & Authorize all advocate routes for advocate role only
router.use(protect)
router.use(authorize('advocate'))

// GET /api/v1/advocate/dashboard - Dashboard metrics & AI matches
router.get('/dashboard', getAdvocateDashboard)

// GET & PUT /api/v1/advocate/profile - Profile management
router.get('/profile', getAdvocateProfile)
router.put('/profile', updateAdvocateProfile)

// GET & PATCH /api/v1/advocate/client-requests - Client requests management
router.get('/client-requests', getClientRequests)
router.patch('/client-requests/:id', updateClientRequestStatus)

// GET /api/v1/advocate/analytics - Profile analytics & views breakdown
router.get('/analytics', getAdvocateAnalytics)

export default router
