import { Router } from 'express'
import { protect } from '../middleware/auth.middleware.js'
import {
  generateReport,
  streamReportPDF,
  getUserReports,
  downloadReport,
  deleteReport,
} from '../controllers/report.controller.js'

const router = Router()

// Protect all report endpoints
router.use(protect)

// GET /api/v1/reports/pdf/:documentId - Stream PDF report directly for instant browser download
router.get('/pdf/:documentId', streamReportPDF)

// POST /api/v1/reports/:documentId/generate - Generate legal analysis PDF report
router.post('/:documentId/generate', generateReport)

// GET /api/v1/reports - List all user reports
router.get('/', getUserReports)

// GET /api/v1/reports/:id - Download / view report PDF
router.get('/:id', downloadReport)

// DELETE /api/v1/reports/:id - Delete report & unlink PDF file
router.delete('/:id', deleteReport)

export default router
