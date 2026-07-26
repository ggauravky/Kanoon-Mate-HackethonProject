import { Router } from 'express'
import {
  register,
  login,
  logout,
  getMe,
  updateProfilePicture,
} from '../controllers/auth.controller.js'
import {
  registerValidation,
  loginValidation,
  validateRequest,
} from '../validators/auth.validator.js'
import { protect } from '../middleware/auth.middleware.js'
import { uploadSingleDocument } from '../middleware/upload.middleware.js'

const router = Router()

// Public Auth Endpoints
router.post('/register', registerValidation, validateRequest, register)
router.post('/login', loginValidation, validateRequest, login)
router.post('/logout', logout)

// Protected Profile Endpoints
router.get('/me', protect, getMe)
router.put('/profile-picture', protect, uploadSingleDocument('profilePicture'), updateProfilePicture)

export default router
