import cloudinary from '../config/cloudinary.js'

// Allowed MIME types and extensions
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

export const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.webp']

/**
 * Upload a file buffer directly to Cloudinary using upload_stream
 * 
 * @param {Buffer} fileBuffer - Buffer of the file to upload
 * @param {Object} options - Upload options (folder, resource_type, fileName)
 * @returns {Promise<{ url: string, publicId: string, format: string, bytes: number, resourceType: string }>}
 */
export const uploadToCloudinary = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const { folder = 'kanoon_mate', resource_type = 'auto', fileName } = options

    const uploadOptions = {
      folder,
      resource_type,
      use_filename: true,
      unique_filename: true,
    }

    if (fileName) {
      uploadOptions.public_id = fileName.replace(/\.[^/.]+$/, '')
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error)
          const uploadErr = new Error(`Cloudinary upload failed: ${error.message || 'Unknown error'}`)
          uploadErr.statusCode = 500
          return reject(uploadErr)
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          bytes: result.bytes,
          resourceType: result.resource_type,
        })
      }
    )

    uploadStream.end(fileBuffer)
  })
}

/**
 * Delete an asset from Cloudinary by public ID
 * 
 * @param {string} publicId - Cloudinary public ID of the resource
 * @param {string} resourceType - Resource type ('image', 'raw', 'video', 'auto')
 * @returns {Promise<Object>} - Cloudinary deletion response
 */
export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId) return null

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    })
    return result
  } catch (error) {
    console.warn(`Cloudinary deletion warning for publicId (${publicId}):`, error.message)
    // Try raw if image failed
    if (resourceType !== 'raw') {
      try {
        return await cloudinary.uploader.destroy(publicId, {
          resource_type: 'raw',
          invalidate: true,
        })
      } catch (rawErr) {
        console.warn(`Cloudinary raw deletion warning for publicId (${publicId}):`, rawErr.message)
      }
    }
    return null
  }
}
