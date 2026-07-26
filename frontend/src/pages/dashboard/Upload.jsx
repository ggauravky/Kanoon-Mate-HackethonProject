import { motion } from 'framer-motion'
import PageHeader from '../../components/common/PageHeader'
import UploadCard from '../../components/upload/UploadCard'

export default function Upload() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      <PageHeader
        title="Upload Legal Document"
        subtitle="Upload your rent agreement, legal notice, sale deed, or affidavit for AI-powered processing."
      />

      {/* Upload Workflow Card */}
      <UploadCard />
    </motion.div>
  )
}
