import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { extractDocumentText } from '../controllers/ocr.controller.js';

const router = Router();

// Protect all routes
router.use(protect);

// POST /api/v1/documents/:id/extract-text - Extract text via PDF parser or Tesseract OCR
router.post('/:id/extract-text', extractDocumentText);

export default router;
