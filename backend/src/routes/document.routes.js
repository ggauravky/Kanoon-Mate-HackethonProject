import { Router } from 'express'
import { protect } from '../middleware/auth.middleware.js'
import { uploadSingleDocument } from '../middleware/upload.middleware.js'
import {
  uploadDocument,
  getUserDocuments,
  getDocumentById,
  deleteDocument,
} from '../controllers/document.controller.js'

const router = Router()

// Protect all document routes
router.use(protect)

// POST /api/v1/documents/upload - Upload file & save metadata
router.post('/upload', uploadSingleDocument('file'), uploadDocument)

// GET /api/v1/documents - Fetch logged-in user's documents
router.get('/', getUserDocuments)

// GET /api/v1/documents/:id - Fetch single document details
router.get('/:id', getDocumentById)

// DELETE /api/v1/documents/:id - Delete document & unlink file from disk
router.delete('/:id', deleteDocument)

export default router
