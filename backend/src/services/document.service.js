import Document from '../models/document.model.js'
import { uploadToCloudinary, deleteFromCloudinary } from './upload.service.js'
import { createNotificationService } from './notification.service.js'

/**
 * Service: Upload document to Cloudinary and create document metadata entry in database
 */
export const createDocumentService = async ({ file, userId, title }) => {
  if (!file) {
    const error = new Error('No file provided for upload')
    error.statusCode = 400
    throw error
  }

  const documentTitle = title?.trim() || file.originalname

  // Upload file buffer directly to Cloudinary
  const resourceType = file.mimetype === 'application/pdf' ? 'raw' : 'auto'
  const cloudinaryResult = await uploadToCloudinary(file.buffer, {
    folder: 'kanoon_mate/documents',
    fileName: file.originalname,
    resource_type: resourceType,
  })

  const newDoc = await Document.create({
    title: documentTitle,
    originalFileName: file.originalname,
    storedFileName: cloudinaryResult.publicId || file.originalname,
    mimeType: file.mimetype,
    fileSize: file.size,
    filePath: cloudinaryResult.url,
    fileUrl: cloudinaryResult.url,
    publicId: cloudinaryResult.publicId,
    uploadedBy: userId,
    uploadStatus: 'uploaded',
  })

  // Auto-generate notification in MongoDB
  try {
    await createNotificationService({
      userId,
      title: 'Document Uploaded Successfully',
      message: `"${documentTitle}" has been uploaded and stored in your Cloudinary vault.`,
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
    error.statusCode = 404
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
 * Service: Delete document record from MongoDB and file from Cloudinary
 */
export const deleteDocumentService = async (documentId, userId) => {
  const document = await getDocumentByIdService(documentId, userId)

  // Remove file from Cloudinary if publicId exists
  if (document.publicId) {
    const resourceType = document.mimeType === 'application/pdf' ? 'raw' : 'image'
    await deleteFromCloudinary(document.publicId, resourceType)
  }

  // Delete database record
  await Document.findByIdAndDelete(documentId)

  return { id: documentId }
}
