import Document from '../models/document.model.js';
import { extractTextFromDocument } from '../services/ocr.service.js';
import { getTextStats } from '../utils/textCleaner.js';

/**
 * @desc    Extract text from uploaded document using PDF parser or Image OCR
 * @route   POST /api/v1/documents/:id/extract-text
 * @access  Private
 */
export const extractDocumentText = async (req, res, next) => {
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
    if (document.uploadedBy.toString() !== userId.toString()) {
      const error = new Error('Access denied. You do not own this document.');
      error.statusCode = 403;
      throw error;
    }

    // 1. Update status to 'Processing OCR'
    document.ocrStatus = 'Processing OCR';
    await document.save();

    // 2. Perform text extraction
    const { cleanedText, wordCount, characterCount, processingTime } =
      await extractTextFromDocument(document.filePath, document.mimeType);

    // 3. Update database record with extracted OCR text and metrics
    document.ocrStatus = 'OCR Completed';
    document.ocrText = cleanedText;
    document.ocrCompletedAt = new Date();
    document.processingTime = processingTime;
    await document.save();

    return res.status(200).json({
      success: true,
      message: 'Text extracted successfully',
      data: {
        documentId: document._id,
        title: document.title,
        ocrStatus: document.ocrStatus,
        ocrText: document.ocrText,
        wordCount,
        characterCount,
        processingTime: document.processingTime,
        ocrCompletedAt: document.ocrCompletedAt,
      },
    });
  } catch (error) {
    // On extraction failure, set status to 'OCR Failed' in database
    if (document) {
      try {
        document.ocrStatus = 'OCR Failed';
        await document.save();
      } catch (saveErr) {
        console.error('Failed to save OCR Failed status:', saveErr.message);
      }
    }
    next(error);
  }
};
