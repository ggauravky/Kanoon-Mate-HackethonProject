import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: [true, 'Document reference is required'],
      index: true,
    },
    reportName: {
      type: String,
      required: [true, 'Report name is required'],
      trim: true,
    },
    reportType: {
      type: String,
      enum: ['legal_analysis_pdf'],
      default: 'legal_analysis_pdf',
    },
    filePath: {
      type: String,
      required: [true, 'Report file path is required'],
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model('Report', reportSchema);

export default Report;
