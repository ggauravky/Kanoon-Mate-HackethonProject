import Document from '../models/document.model.js';
import { generateLegalAnalysisService } from '../services/ai.service.js';

/**
 * @desc    Analyze extracted document OCR text using Google Gemini AI
 * @route   POST /api/v1/documents/:id/analyze
 * @access  Private
 */
export const analyzeDocument = async (req, res, next) => {
  const userId = req.user?._id || req.user?.id;
  const documentId = req.params.id;

  let document = null;

  try {
    document = await Document.findById(documentId);

    if (!document) {
      const error = new Error('Document not found');
      error.statusCode = 404;
      throw error;
    }

    // Verify ownership
    if (document.uploadedBy && document.uploadedBy.toString() !== userId?.toString()) {
      const error = new Error('Access denied. You do not own this document.');
      error.statusCode = 403;
      throw error;
    }

    // 1. Verify OCR text exists
    if (!document.ocrText || document.ocrText.trim() === '') {
      const error = new Error('OCR text is empty or missing. Please perform OCR text extraction before running AI analysis.');
      error.statusCode = 400;
      throw error;
    }

    // 2. Caching Check: If already analyzed and complete, return cached analysis immediately
    if (document.analysisStatus === 'AI Completed' && document.analysis && document.analysis.summary) {
      return res.status(200).json({
        success: true,
        message: 'Document analysis retrieved from cache',
        cached: true,
        data: {
          documentId: document._id,
          title: document.title,
          analysisStatus: document.analysisStatus,
          analysis: document.analysis,
          analysisCompletedAt: document.analysisCompletedAt,
        },
      });
    }

    // 3. Update status to 'AI Processing'
    document.analysisStatus = 'AI Processing';
    await document.save();

    // 4. Generate structured analysis using Gemini API service
    const analysisResult = await generateLegalAnalysisService(document.ocrText, {
      title: document.title,
      originalFileName: document.originalFileName,
    });

    // 5. Update database record with analysis result
    document.analysis = analysisResult;
    document.analysisStatus = 'AI Completed';
    document.uploadStatus = 'analyzed';
    document.analysisCompletedAt = new Date();
    await document.save();

    return res.status(200).json({
      success: true,
      message: 'AI Legal Document Analysis completed successfully',
      cached: false,
      data: {
        documentId: document._id,
        title: document.title,
        analysisStatus: document.analysisStatus,
        analysis: document.analysis,
        analysisCompletedAt: document.analysisCompletedAt,
      },
    });
  } catch (error) {
    if (document) {
      try {
        document.analysisStatus = 'Failed';
        await document.save();
      } catch (saveErr) {
        console.error('Failed to save AI Failed status:', saveErr.message);
      }
    }
    next(error);
  }
};

/**
 * @desc    Get existing analysis of a document
 * @route   GET /api/v1/documents/:id/analysis
 * @access  Private
 */
export const getDocumentAnalysis = async (req, res, next) => {
  const userId = req.user?._id || req.user?.id;
  const documentId = req.params.id;

  try {
    const document = await Document.findById(documentId);

    if (!document) {
      const error = new Error('Document not found');
      error.statusCode = 404;
      throw error;
    }

    // Verify ownership
    if (document.uploadedBy && document.uploadedBy.toString() !== userId?.toString()) {
      const error = new Error('Access denied. You do not own this document.');
      error.statusCode = 403;
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: 'Document analysis retrieved successfully',
      data: {
        documentId: document._id,
        title: document.title,
        analysisStatus: document.analysisStatus,
        analysis: document.analysis,
        analysisCompletedAt: document.analysisCompletedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
