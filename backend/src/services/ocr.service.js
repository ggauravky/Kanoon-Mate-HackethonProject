import fs from 'fs/promises'
import path from 'path'
import { PDFParse } from 'pdf-parse'
import { createWorker } from 'tesseract.js'
import { cleanText, getTextStats } from '../utils/textCleaner.js'

/**
 * Helper to fetch file buffer from a remote URL (Cloudinary)
 */
const fetchFileBuffer = async (url) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch file from Cloudinary URL: ${response.statusText}`)
  }
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

/**
 * Performs OCR and text extraction on a document given its file path/URL and MIME type.
 * Supports PDF (application/pdf) and Images (image/png, image/jpeg, image/jpg, image/webp).
 * 
 * @param {string} fileLocationOrUrl - Path or URL to uploaded document file
 * @param {string} mimeType - Document MIME type
 * @returns {Promise<{ cleanedText: string, wordCount: number, characterCount: number, processingTime: number }>}
 */
export const extractTextFromDocument = async (fileLocationOrUrl, mimeType) => {
  const startTime = Date.now()
  const isUrl = fileLocationOrUrl && (fileLocationOrUrl.startsWith('http://') || fileLocationOrUrl.startsWith('https://'))

  let fileBuffer = null
  let imageSource = fileLocationOrUrl

  if (isUrl) {
    if (mimeType === 'application/pdf') {
      fileBuffer = await fetchFileBuffer(fileLocationOrUrl)
    }
  } else {
    const absolutePath = path.resolve(fileLocationOrUrl)
    try {
      await fs.access(absolutePath)
    } catch {
      const error = new Error('Document file could not be found on disk or remote server')
      error.statusCode = 404
      throw error
    }
    if (mimeType === 'application/pdf') {
      fileBuffer = await fs.readFile(absolutePath)
    } else {
      imageSource = absolutePath
    }
  }

  let rawExtractedText = ''

  // Perform extraction based on file type
  try {
    if (mimeType === 'application/pdf') {
      if (!fileBuffer && isUrl) {
        fileBuffer = await fetchFileBuffer(fileLocationOrUrl)
      }
      const parser = new PDFParse({ data: fileBuffer })

      try {
        const pdfData = await parser.getText()
        rawExtractedText = pdfData.text || ''
      } finally {
        await parser.destroy()
      }
    } else if (['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(mimeType)) {
      const worker = await createWorker('eng')
      const { data } = await worker.recognize(imageSource)
      await worker.terminate()
      rawExtractedText = data.text || ''
    } else {
      const error = new Error(`Unsupported file type: ${mimeType}. Only PDF, PNG, JPG, JPEG, and WEBP are supported.`)
      error.statusCode = 400
      throw error
    }
  } catch (extractionError) {
    if (extractionError.statusCode) throw extractionError
    const error = new Error(`Text extraction engine failed: ${extractionError.message}`)
    error.statusCode = 500
    throw error
  }

  // Clean and sanitize extracted text
  const cleanedText = cleanText(rawExtractedText)

  // Validate non-empty content
  if (!cleanedText) {
    const error = new Error('No readable text could be extracted from this document. The file may be blank, corrupted, or password-protected.')
    error.statusCode = 422
    throw error
  }

  // Calculate statistics and elapsed processing time
  const { characterCount, wordCount } = getTextStats(cleanedText)
  const processingTime = Date.now() - startTime

  return {
    cleanedText,
    wordCount,
    characterCount,
    processingTime,
  }
}
