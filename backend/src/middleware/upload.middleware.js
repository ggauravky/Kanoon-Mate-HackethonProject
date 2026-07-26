import multer from 'multer'
import path from 'path'
import crypto from 'crypto'
import fs from 'fs'

// Ensure uploads directory exists
const uploadDir = path.resolve('uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// ─── Multer Disk Storage Configuration ───────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    // Generate unique file name: timestamp-random-sanitizedName
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`
    const ext = path.extname(file.originalname).toLowerCase()
    const sanitizedBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')

    cb(null, `${sanitizedBase}-${uniqueSuffix}${ext}`)
  },
})

// ─── Allowed File Formats ───────────────────────────────────────────────────
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
]

const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png']

// ─── File Filter Middleware ──────────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase()
  const isValidMime = ALLOWED_MIME_TYPES.includes(file.mimetype)
  const isValidExt = ALLOWED_EXTENSIONS.includes(ext)

  if (isValidMime && isValidExt) {
    return cb(null, true)
  }

  const error = new Error('Invalid file type. Only PDF, JPG, JPEG, and PNG files are allowed.')
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
