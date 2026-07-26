import { Router } from 'express'
import {
  register,
  login,
  logout,
  getMe,
} from '../controllers/auth.controller.js'
import {
  registerValidation,
  loginValidation,
  validateRequest,
} from '../validators/auth.validator.js'
import { protect } from '../middleware/auth.middleware.js'

const router = Router()

// Public Auth Endpoints
router.post('/register', registerValidation, validateRequest, register)
router.post('/login', loginValidation, validateRequest, login)
router.post('/logout', logout)

// Protected Profile Endpoint
router.get('/me', protect, getMe)

export default router
