import Report from '../models/report.model.js'
import Document from '../models/document.model.js'
import { buildLegalReportPDF } from '../services/report.service.js'
import { createNotificationService } from '../services/notification.service.js'
import { deleteFromCloudinary } from '../services/upload.service.js'

/**
 * @desc    Generate a downloadable PDF Legal Report for a document (stored on Cloudinary)
 * @route   POST /api/v1/reports/:documentId/generate
 * @access  Private
 */
export const generateReport = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id
    const { documentId } = req.params

    const document = await Document.findById(documentId)

    if (!document) {
      const error = new Error('Document not found')
      error.statusCode = 404
      throw error
    }

    if (document.uploadedBy.toString() !== userId.toString()) {
      const error = new Error('Access denied. You do not own this document.')
      error.statusCode = 403
      throw error
    }

    // Check if AI Analysis is present
    if (!document.analysis || !document.analysis.summary) {
      const error = new Error('Document AI analysis is not completed yet. Please analyze the document first.')
      error.statusCode = 400
      throw error
    }

    // Build PDF report via report.service & upload to Cloudinary
    const pdfResult = await buildLegalReportPDF(document, req.user)

    // Save report entry in database
    const report = await Report.create({
      user: userId,
      document: document._id,
      reportName: pdfResult.reportName,
      reportType: 'legal_analysis_pdf',
      filePath: pdfResult.filePath,
      fileUrl: pdfResult.fileUrl,
      publicId: pdfResult.publicId,
      fileSize: pdfResult.fileSize,
      generatedAt: new Date(),
    })

    // Auto-generate notification in MongoDB
    try {
      await createNotificationService({
        userId,
        title: 'Executive Legal Report Generated',
        message: `Downloadable PDF audit report ready for "${document.title}".`,
        type: 'Report Generated',
        priority: 'Medium',
        relatedDocument: document._id,
      })
    } catch (notifErr) {
      console.warn('Failed to auto-create report notification:', notifErr.message)
    }

    return res.status(201).json({
      success: true,
      message: 'Legal PDF report generated successfully',
      data: {
        report,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Generate and stream direct PDF report binary for instant browser download
 * @route   GET /api/v1/reports/pdf/:documentId
 * @access  Private
 */
export const streamReportPDF = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id
    const { documentId } = req.params

    const document = await Document.findById(documentId)

    if (!document) {
      const error = new Error('Document not found')
      error.statusCode = 404
      throw error
    }

    if (document.uploadedBy.toString() !== userId.toString()) {
      const error = new Error('Access denied. You do not own this document.')
      error.statusCode = 403
      throw error
    }

    if (!document.analysis || !document.analysis.summary) {
      const error = new Error('Document AI analysis is not completed yet. Please analyze the document first.')
      error.statusCode = 400
      throw error
    }

    const pdfResult = await buildLegalReportPDF(document, req.user)

    // Save report metadata in database
    try {
      await Report.create({
        user: userId,
        document: document._id,
        reportName: pdfResult.reportName,
        reportType: 'legal_analysis_pdf',
        filePath: pdfResult.filePath,
        fileUrl: pdfResult.fileUrl,
        publicId: pdfResult.publicId,
        fileSize: pdfResult.fileSize,
        generatedAt: new Date(),
      })
    } catch (reportSaveErr) {
      console.warn('Metadata save error:', reportSaveErr.message)
    }

    const sanitizedTitle = (document.title || 'Legal_Document').replace(/[^a-zA-Z0-9]/g, '_')
    const filename = `Legal_Report_${sanitizedTitle}.pdf`

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.setHeader('Content-Length', pdfResult.pdfBuffer.length)

    return res.status(200).send(pdfResult.pdfBuffer)
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get all generated reports for current user
 * @route   GET /api/v1/reports
 * @access  Private
 */
export const getUserReports = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id
    const { search } = req.query

    let query = { user: userId }

    if (search && search.trim()) {
      query.reportName = { $regex: search.trim(), $options: 'i' }
    }

    const reports = await Report.find(query)
      .populate('document', 'title originalFileName mimeType')
      .sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      count: reports.length,
      data: {
        reports,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Download / Stream a generated report PDF file from Cloudinary or local
 * @route   GET /api/v1/reports/:id
 * @access  Private
 */
export const downloadReport = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id
    const { id } = req.params

    const report = await Report.findById(id).populate('document', 'title originalFileName')

    if (!report) {
      const error = new Error('Report not found')
      error.statusCode = 404
      throw error
    }

    if (report.user.toString() !== userId.toString()) {
      const error = new Error('Access denied. You do not own this report.')
      error.statusCode = 403
      throw error
    }

    // If metadata format requested via query header
    if (req.query.format === 'json') {
      return res.status(200).json({
        success: true,
        data: { report },
      })
    }

    // Direct redirect to Cloudinary URL if available
    const targetUrl = report.fileUrl || report.filePath
    if (targetUrl && (targetUrl.startsWith('http://') || targetUrl.startsWith('https://'))) {
      return res.redirect(targetUrl)
    }

    return res.status(404).json({
      success: false,
      message: 'Report file URL not found.',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Delete a generated report and remove file from Cloudinary
 * @route   DELETE /api/v1/reports/:id
 * @access  Private
 */
export const deleteReport = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id
    const { id } = req.params

    const report = await Report.findById(id)

    if (!report) {
      const error = new Error('Report not found')
      error.statusCode = 404
      throw error
    }

    if (report.user.toString() !== userId.toString()) {
      const error = new Error('Access denied. You do not own this report.')
      error.statusCode = 403
      throw error
    }

    // Remove file from Cloudinary if publicId exists
    if (report.publicId) {
      await deleteFromCloudinary(report.publicId, 'raw')
    }

    await Report.findByIdAndDelete(id)

    return res.status(200).json({
      success: true,
      message: 'Report deleted successfully',
      data: { id },
    })
  } catch (error) {
    next(error)
  }
}
