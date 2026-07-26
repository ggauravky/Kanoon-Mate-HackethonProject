import fs from 'fs/promises';
import path from 'path';
import { PDFParse } from 'pdf-parse';
import { createWorker } from 'tesseract.js';
import { cleanText, getTextStats } from '../utils/textCleaner.js';

/**
 * Performs OCR and text extraction on a document given its file path and MIME type.
 * Supports PDF (application/pdf) and Images (image/png, image/jpeg, image/jpg).
 * 
 * @param {string} relativeOrAbsolutePath - Path to uploaded document file
 * @param {string} mimeType - Document MIME type
 * @returns {Promise<{ cleanedText: string, wordCount: number, characterCount: number, processingTime: number }>}
 */
export const extractTextFromDocument = async (relativeOrAbsolutePath, mimeType) => {
  const startTime = Date.now();
  const absolutePath = path.resolve(relativeOrAbsolutePath);

  // 1. Verify physical file existence
  try {
    await fs.access(absolutePath);
  } catch {
    const error = new Error('Document file could not be found on disk');
    error.statusCode = 404;
    throw error;
  }

  let rawExtractedText = '';

  // 2. Perform extraction based on file type
  try {
    if (mimeType === 'application/pdf') {
      const fileBuffer = await fs.readFile(absolutePath);
      const parser = new PDFParse({ data: fileBuffer });

      try {
        const pdfData = await parser.getText();
        rawExtractedText = pdfData.text || '';
      } finally {
        await parser.destroy();
      }
    } else if (['image/png', 'image/jpeg', 'image/jpg'].includes(mimeType)) {
      const worker = await createWorker('eng');
      const { data } = await worker.recognize(absolutePath);
      await worker.terminate();
      rawExtractedText = data.text || '';
    } else {
      const error = new Error(`Unsupported file type: ${mimeType}. Only PDF, PNG, JPG, and JPEG are supported.`);
      error.statusCode = 400;
      throw error;
    }
  } catch (extractionError) {
    if (extractionError.statusCode) throw extractionError;
    const error = new Error(`Text extraction engine failed: ${extractionError.message}`);
    error.statusCode = 500;
    throw error;
  }

  // 3. Clean and sanitize extracted text
  const cleanedText = cleanText(rawExtractedText);

  // 4. Validate non-empty content
  if (!cleanedText) {
    const error = new Error('No readable text could be extracted from this document. The file may be blank, corrupted, or password-protected.');
    error.statusCode = 422;
    throw error;
  }

  // 5. Calculate statistics and elapsed processing time
  const { characterCount, wordCount } = getTextStats(cleanedText);
  const processingTime = Date.now() - startTime;

  return {
    cleanedText,
    wordCount,
    characterCount,
    processingTime,
  };
};
