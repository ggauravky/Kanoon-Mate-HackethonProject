import mongoose from 'mongoose'

const clientRequestSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    advocate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdvocateProfile',
      required: true,
      index: true,
    },
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
    },
    legalCategory: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    clientCity: {
      type: String,
      default: 'Delhi',
    },
    matchScore: {
      type: Number,
      default: 95,
    },
    matchReason: {
      type: String,
      default: 'Practice Area & Location Specialization Match',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'completed'],
      default: 'pending',
      index: true,
    },
    note: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

const ClientRequest =
  mongoose.models.ClientRequest ||
  mongoose.model('ClientRequest', clientRequestSchema)

export default ClientRequest
