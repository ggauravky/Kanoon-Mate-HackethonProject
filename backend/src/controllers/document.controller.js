import {
  createDocumentService,
  getUserDocumentsService,
  getDocumentByIdService,
  deleteDocumentService,
} from '../services/document.service.js'

/**
 * @desc    Upload new document
 * @route   POST /api/v1/documents/upload
 * @access  Private (Authenticated User)
 */
export const uploadDocument = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id
    const title = req.body?.title

    const document = await createDocumentService({
      file: req.file,
      userId,
      title,
    })

    res.status(201).json({
      success: true,
      message: 'Legal document uploaded successfully',
      data: {
        document,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get current user's uploaded documents
 * @route   GET /api/v1/documents
 * @access  Private
 */
export const getUserDocuments = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id
    const documents = await getUserDocumentsService(userId)

    res.status(200).json({
      success: true,
      count: documents.length,
      data: {
        documents,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get single document details by ID
 * @route   GET /api/v1/documents/:id
 * @access  Private
 */
export const getDocumentById = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id
    const documentId = req.params.id

    const document = await getDocumentByIdService(documentId, userId)

    res.status(200).json({
      success: true,
      data: {
        document,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Delete single document by ID
 * @route   DELETE /api/v1/documents/:id
 * @access  Private
 */
export const deleteDocument = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id
    const documentId = req.params.id

    await deleteDocumentService(documentId, userId)

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
      data: {
        id: documentId,
      },
    })
  } catch (error) {
    next(error)
  }
}
