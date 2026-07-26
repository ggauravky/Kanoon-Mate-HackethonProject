import fs from 'fs/promises';
import path from 'path';
import Report from '../models/report.model.js';
import Document from '../models/document.model.js';
import { buildLegalReportPDF } from '../services/report.service.js';

/**
 * @desc    Generate a downloadable PDF Legal Report for a document
 * @route   POST /api/v1/reports/:documentId/generate
 * @access  Private
 */
export const generateReport = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { documentId } = req.params;

    const document = await Document.findById(documentId);

    if (!document) {
      const error = new Error('Document not found');
      error.statusCode = 404;
      throw error;
    }

    if (document.uploadedBy.toString() !== userId.toString()) {
      const error = new Error('Access denied. You do not own this document.');
      error.statusCode = 403;
      throw error;
    }

    // Check if AI Analysis is present
    if (!document.analysis || !document.analysis.summary) {
      const error = new Error('Document AI analysis is not completed yet. Please analyze the document first.');
      error.statusCode = 400;
      throw error;
    }

    // Build PDF report via report.service
    const pdfResult = await buildLegalReportPDF(document, req.user);

    // Save report entry in database
    const report = await Report.create({
      user: userId,
      document: document._id,
      reportName: pdfResult.reportName,
      reportType: 'legal_analysis_pdf',
      filePath: pdfResult.filePath,
      fileSize: pdfResult.fileSize,
      generatedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: 'Legal PDF report generated successfully',
      data: {
        report,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all generated reports for current user
 * @route   GET /api/v1/reports
 * @access  Private
 */
export const getUserReports = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { search } = req.query;

    let query = { user: userId };

    if (search && search.trim()) {
      query.reportName = { $regex: search.trim(), $options: 'i' };
    }

    const reports = await Report.find(query)
      .populate('document', 'title originalFileName mimeType')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reports.length,
      data: {
        reports,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Download / Stream a generated report PDF file
 * @route   GET /api/v1/reports/:id
 * @access  Private
 */
export const downloadReport = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { id } = req.params;

    const report = await Report.findById(id).populate('document', 'title originalFileName');

    if (!report) {
      const error = new Error('Report not found');
      error.statusCode = 404;
      throw error;
    }

    if (report.user.toString() !== userId.toString()) {
      const error = new Error('Access denied. You do not own this report.');
      error.statusCode = 403;
      throw error;
    }

    const fullPath = path.resolve(report.filePath);

    try {
      await fs.access(fullPath);
    } catch {
      const error = new Error('Report PDF file not found on server disk.');
      error.statusCode = 404;
      throw error;
    }

    // If metadata format requested via query header
    if (req.query.format === 'json') {
      return res.status(200).json({
        success: true,
        data: { report },
      });
    }

    // Stream PDF for download / inline display
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${report.reportName}"`
    );
    return res.sendFile(fullPath);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a generated report and unlink file from disk
 * @route   DELETE /api/v1/reports/:id
 * @access  Private
 */
export const deleteReport = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { id } = req.params;

    const report = await Report.findById(id);

    if (!report) {
      const error = new Error('Report not found');
      error.statusCode = 404;
      throw error;
    }

    if (report.user.toString() !== userId.toString()) {
      const error = new Error('Access denied. You do not own this report.');
      error.statusCode = 403;
      throw error;
    }

    // Remove file from disk
    try {
      const fullPath = path.resolve(report.filePath);
      await fs.unlink(fullPath);
    } catch (fsErr) {
      console.warn(`Physical report deletion warning for ${report.filePath}:`, fsErr.message);
    }

    await Report.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Report deleted successfully',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};
