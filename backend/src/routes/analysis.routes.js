import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { analyzeDocument, getDocumentAnalysis } from '../controllers/analysis.controller.js';

const router = Router();

// Protect all routes
router.use(protect);

// POST /api/v1/documents/:id/analyze - Run AI analysis on document OCR text
router.post('/:id/analyze', analyzeDocument);

// GET /api/v1/documents/:id/analysis - Get document AI analysis results
router.get('/:id/analysis', getDocumentAnalysis);

export default router;
