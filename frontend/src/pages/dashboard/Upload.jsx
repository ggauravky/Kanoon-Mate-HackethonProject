import { motion } from 'framer-motion'
import { Upload as UploadIcon, FileText, AlertCircle } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import SectionCard from '../../components/common/SectionCard'

export default function Upload() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Upload Document"
        subtitle="Upload a legal document for AI-powered analysis."
      />

      <SectionCard>
        {/* Drop Zone */}
        <motion.div
          whileHover={{ borderColor: 'var(--color-primary)', backgroundColor: 'var(--color-primary-50)' }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface-alt)] p-12 text-center cursor-pointer transition-colors"
          id="upload-dropzone"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary-50)] mb-4">
            <UploadIcon size={26} className="text-[var(--color-primary)]" />
          </div>
          <p className="text-sm font-semibold text-[var(--color-text)]">
            Drag & drop your document here
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            or click to browse from your computer
          </p>
          <p className="mt-3 text-xs text-[var(--color-text-muted)]">
            Supported: PDF, DOCX, DOC, JPG, PNG · Max 20 MB
          </p>
          <button className="btn-primary mt-5 gap-2" id="browse-files-btn">
            <FileText size={14} /> Browse Files
          </button>
        </motion.div>

        {/* Info Notice */}
        <div className="mt-4 flex gap-2.5 rounded-lg bg-[var(--color-primary-50)] p-3.5 border border-[var(--color-primary-100)]">
          <AlertCircle size={16} className="text-[var(--color-primary)] shrink-0 mt-0.5" />
          <p className="text-xs text-[var(--color-primary-dark)] leading-relaxed">
            Document upload and OCR-based AI analysis will be available in Phase 6.
            This UI is a placeholder for the upload interface.
          </p>
        </div>
      </SectionCard>

      {/* Document Type Selection */}
      <SectionCard title="Document Type">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {['Rent Agreement', 'Legal Notice', 'Sale Deed', 'Employment Contract', 'FIR Copy', 'Other'].map((type) => (
            <button
              key={type}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2.5 text-xs font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-50)] transition-all"
            >
              {type}
            </button>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
