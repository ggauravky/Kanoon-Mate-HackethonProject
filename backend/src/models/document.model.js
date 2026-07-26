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

    // Phase 30 AI Legal Guidance Center Schema
    emergencyWarning: {
      detected: { type: Boolean, default: false },
      warningMessage: { type: String, default: '' },
    },
    actionPlan: [
      {
        step: { type: Number, default: 1 },
        title: { type: String, default: '' },
        description: { type: String, default: '' },
        priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
        estimatedTime: { type: String, default: '' },
        isMandatory: { type: Boolean, default: true },
      },
    ],
    requiredDocuments: [
      {
        name: { type: String, default: '' },
        reason: { type: String, default: '' },
        type: { type: String, enum: ['Mandatory', 'Optional', 'Conditional'], default: 'Mandatory' },
        whyUseful: { type: String, default: '' },
      },
    ],
    evidenceChecklist: [
      {
        name: { type: String, default: '' },
        type: { type: String, enum: ['Digital', 'Physical', 'Witness'], default: 'Digital' },
        instructions: { type: String, default: '' },
      },
    ],
    contactAuthorities: [
      {
        name: { type: String, default: '' },
        reason: { type: String, default: '' },
        purpose: { type: String, default: '' },
        whenToContact: { type: String, default: '' },
      },
    ],
    deadlines: [
      {
        deadline: { type: String, default: '' },
        reason: { type: String, default: '' },
        priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'High' },
      },
    ],
    mistakesToAvoid: [
      {
        mistake: { type: String, default: '' },
        consequence: { type: String, default: '' },
      },
    ],
    helpfulSuggestions: [
      {
        tip: { type: String, default: '' },
        category: { type: String, default: 'Documentation' },
      },
    ],
    lawyerRecommendation: {
      urgency: {
        type: String,
        enum: ['Immediately', 'Within a Few Days', 'Optional', 'Not Necessary Yet'],
        default: 'Within a Few Days',
      },
      reason: { type: String, default: '' },
    },
    recommendedAdvocateType: { type: String, default: '' },
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
      trim: true,
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
      enum: {
        values: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        message: 'Invalid file format. Only PDF, JPG, JPEG, PNG, and WEBP files are allowed.',
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
    fileUrl: {
      type: String,
      default: '',
    },
    publicId: {
      type: String,
      default: '',
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

// ─── Indexes ────────────────────────────────────────────────────────────────
documentSchema.index({ uploadedBy: 1, createdAt: -1 })
documentSchema.index({ uploadStatus: 1 })
documentSchema.index({ analysisStatus: 1 })

const Document = mongoose.model('Document', documentSchema)

export default Document
