import multer from 'multer'
import path from 'path'
import { ALLOWED_MIME_TYPES, ALLOWED_EXTENSIONS } from '../services/upload.service.js'

// ─── Multer Memory Storage Configuration (No local disk persistence) ────────
const storage = multer.memoryStorage()

// ─── File Filter Middleware ──────────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase()
  const isValidMime = ALLOWED_MIME_TYPES.includes(file.mimetype)
  const isValidExt = ALLOWED_EXTENSIONS.includes(ext)

  if (isValidMime && isValidExt) {
    return cb(null, true)
  }

  const error = new Error(
    'Invalid file format. Only PDF, PNG, JPEG, JPG, and WEBP files are supported.'
  )
  error.statusCode = 400
  cb(error, false)
}

// ─── Multer Middleware Instance ──────────────────────────────────────────────
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB Limit
  },
})

// Single File Upload Middleware with Error Wrapper
export const uploadSingleDocument = (fieldName = 'file') => {
  const multerSingle = upload.single(fieldName)

  return (req, res, next) => {
    multerSingle(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File size exceeds maximum allowed limit of 20 MB.',
          })
        }
        return res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`,
        })
      } else if (err) {
        return res.status(err.statusCode || 400).json({
          success: false,
          message: err.message || 'File upload failed validation.',
        })
      }
      next()
    })
  }
}
