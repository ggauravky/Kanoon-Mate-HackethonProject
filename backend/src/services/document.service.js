import Document from '../models/document.model.js'
import fs from 'fs/promises'
import path from 'path'
import { createNotificationService } from './notification.service.js'

/**
 * Service: Create document metadata entry in database
 */
export const createDocumentService = async ({ file, userId, title }) => {
  if (!file) {
    const error = new Error('No file provided for upload')
    error.statusCode = 400
    throw error
  }

  const documentTitle = title?.trim() || file.originalname

  const newDoc = await Document.create({
    title: documentTitle,
    originalFileName: file.originalname,
    storedFileName: file.filename,
    mimeType: file.mimetype,
    fileSize: file.size,
    filePath: file.path.replace(/\\/g, '/'), // normalize Windows backslashes
    uploadedBy: userId,
    uploadStatus: 'uploaded',
  })

  // Auto-generate notification in MongoDB
  try {
    await createNotificationService({
      userId,
      title: 'Document Uploaded Successfully',
      message: `"${documentTitle}" has been uploaded and stored in your vault.`,
      type: 'Document Uploaded',
      priority: 'Low',
      relatedDocument: newDoc._id,
    })
  } catch (notifErr) {
    console.warn('Failed to auto-create upload notification:', notifErr.message)
  }

  return newDoc
}

/**
 * Service: Get all documents uploaded by user
 */
export const getUserDocumentsService = async (userId) => {
  return await Document.find({ uploadedBy: userId }).sort({ createdAt: -1 })
}

/**
 * Service: Get single document by ID with ownership check
 */
export const getDocumentByIdService = async (documentId, userId) => {
  const document = await Document.findById(documentId)

  if (!document) {
    const error = new Error('Document not found')
    error.statusCode = 44
    throw error
  }

  // Ensure user owns document
  if (document.uploadedBy.toString() !== userId.toString()) {
    const error = new Error('Access denied. You do not own this document.')
    error.statusCode = 403
    throw error
  }

  return document
}

/**
 * Service: Delete document record and physical file from disk
 */
export const deleteDocumentService = async (documentId, userId) => {
  const document = await getDocumentByIdService(documentId, userId)

  // Remove physical file from uploads folder
  try {
    const fullPath = path.resolve(document.filePath)
    await fs.unlink(fullPath)
  } catch (fsErr) {
    console.warn(`Physical file deletion warning for ${document.filePath}:`, fsErr.message)
  }

  // Delete database record
  await Document.findByIdAndDelete(documentId)

  return { id: documentId }
}
