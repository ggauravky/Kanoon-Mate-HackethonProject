import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload as UploadIcon, AlertCircle } from 'lucide-react'
import Dropzone from './Dropzone'
import FilePreview from './FilePreview'
import UploadProgress from './UploadProgress'
import UploadSuccess from './UploadSuccess'
import { documentsAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function UploadCard() {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [uploadedDoc, setUploadedDoc] = useState(null)

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile)
    setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''))
    setError('')
  }

  const handleRemoveFile = () => {
    setFile(null)
    setTitle('')
    setError('')
    setProgress(0)
  }

  const handleUploadSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a PDF or image file first.')
      return
    }

    setUploading(true)
    setError('')
    setProgress(10)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title || file.name)

    try {
      // Send multipart upload with progress tracking
      const response = await documentsAPI.uploadDocument(formData, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setProgress(percent)
        }
      })

      const docData = response.data?.data?.document
      if (!docData) {
        throw new Error('Upload succeeded but server did not return document payload.')
      }

      setUploadedDoc(docData)
      toast.success('Document uploaded successfully!')
    } catch (err) {
      const errorMsg = err.message || 'Failed to upload document to server.'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
      {uploadedDoc ? (
        <UploadSuccess document={uploadedDoc} />
      ) : (
        <form onSubmit={handleUploadSubmit} className="space-y-5">
          {/* Title Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Document Display Title (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Rent Agreement Noida Sector 21"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={uploading}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
            />
          </div>

          {/* Dropzone or Preview */}
          {!file ? (
            <Dropzone onFileSelect={handleFileSelect} disabled={uploading} />
          ) : (
            <div className="space-y-4">
              <FilePreview file={file} onRemove={handleRemoveFile} disabled={uploading} />

              {uploading && <UploadProgress progress={progress} fileName={file.name} />}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
              <AlertCircle size={16} className="shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Upload CTA Button */}
          {file && !uploading && (
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold py-3.5 px-6 text-sm shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <UploadIcon size={18} />
              <span>Upload Document to Cloud</span>
            </button>
          )}
        </form>
      )}
    </div>
  )
}
