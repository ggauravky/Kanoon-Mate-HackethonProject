import { useDropzone } from 'react-dropzone'
import { Upload, FileText, AlertCircle, Sparkles } from 'lucide-react'

export default function Dropzone({ onFileSelect, disabled }) {
  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0])
      }
    },
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: 20 * 1024 * 1024, // 20 MB Limit
    multiple: false,
    disabled,
  })

  // Format Rejection Errors
  const errorMessage = fileRejections.length > 0 ? (() => {
    const error = fileRejections[0].errors[0]
    if (error.code === 'file-too-large') {
      return 'File size exceeds maximum allowed limit of 20 MB.'
    }
    if (error.code === 'file-invalid-type') {
      return 'Invalid file type. Only PDF, JPG, JPEG, and PNG files are allowed.'
    }
    return error.message
  })() : null

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-indigo-600 bg-indigo-50/80 scale-[1.01]'
            : 'border-slate-300 bg-slate-50/50 hover:bg-slate-100/80 hover:border-indigo-400'
        } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} id="document-dropzone-input" />
        
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white mb-4 shadow-md shadow-indigo-500/20">
          <Upload size={26} />
        </div>

        <p className="text-sm font-bold text-slate-800">
          {isDragActive ? 'Drop your legal document here…' : 'Drag & drop your legal document here'}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          or click to browse from your computer
        </p>

        <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-xs">
          <FileText size={13} className="text-indigo-600" />
          <span>Supported: PDF, JPG, JPEG, PNG (Max 20 MB)</span>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
          <AlertCircle size={16} className="shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  )
}
