import mongoose from 'mongoose'

const analysisSchema = new mongoose.Schema(
  {
    documentType: { type: String, default: '' },
    language: { type: String, default: '' },
    summary: { type: String, default: '' },
    simpleExplanation: { type: String, default: '' },
    keyPoints: [{ type: String }],
    importantDates: [
      {
        date: { type: String, default: '' },
        description: { type: String, default: '' },
      },
    ],
    detectedLaws: [
      {
        act: { type: String, default: '' },
        section: { type: String, default: '' },
        reason: { type: String, default: '' },
      },
    ],
    requiredActions: [{ type: String }],
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', ''],
      default: '',
    },
    questionsYouMayAsk: [{ type: String }],
    disclaimer: { type: String, default: '' },
  },
  { _id: false }
)

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Document title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    originalFileName: {
      type: String,
      required: [true, 'Original file name is required'],
      trim: true,
    },
    storedFileName: {
      type: String,
      required: [true, 'Stored file name is required'],
      unique: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
      enum: {
        values: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
        message: 'Invalid file format. Only PDF, JPG, JPEG, and PNG files are allowed.',
      },
    },
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
      max: [20 * 1024 * 1024, 'File size cannot exceed 20 MB'],
    },
    filePath: {
      type: String,
      required: [true, 'File path is required'],
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    uploadStatus: {
      type: String,
      enum: ['uploaded', 'processing', 'analyzed', 'failed'],
      default: 'uploaded',
    },
    ocrStatus: {
      type: String,
      enum: ['Uploaded', 'Processing OCR', 'OCR Completed', 'OCR Failed'],
      default: 'Uploaded',
    },
    ocrText: {
      type: String,
      default: '',
    },
    ocrCompletedAt: {
      type: Date,
      default: null,
    },
    analysisStatus: {
      type: String,
      enum: ['Uploaded', 'OCR Complete', 'AI Processing', 'AI Completed', 'Failed'],
      default: 'Uploaded',
    },
    analysis: {
      type: analysisSchema,
      default: () => ({}),
    },
    analysisCompletedAt: {
      type: Date,
      default: null,
    },
    processingTime: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

const Document = mongoose.model('Document', documentSchema)

export default Document
