import { Router } from 'express'
import { protect } from '../middleware/auth.middleware.js'
import {
  getAdvocates,
  getAdvocateById,
  getRecommendedAdvocates,
  toggleFavoriteAdvocate,
  getFavoriteAdvocates,
} from '../controllers/advocate.controller.js'

const router = Router()

// Public / General Directory Routes
router.get('/', getAdvocates)

// Protected Recommendation & Favorites Endpoints
router.get('/favorites', protect, getFavoriteAdvocates)
router.get('/recommended/:documentId', protect, getRecommendedAdvocates)
router.post('/:id/favorite', protect, toggleFavoriteAdvocate)

// Single Profile Route
router.get('/:id', getAdvocateById)

export default router
