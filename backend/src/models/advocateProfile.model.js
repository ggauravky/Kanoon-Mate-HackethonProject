import mongoose from 'mongoose'

const advocateProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
      index: true,
    },
    barCouncilNumber: {
      type: String,
      required: [true, 'Bar Council Registration Number is required'],
      trim: true,
    },
    practiceAreas: [
      {
        type: String,
        trim: true,
      },
    ],
    experience: {
      type: Number,
      required: [true, 'Years of experience is required'],
      default: 5,
    },
    officeAddress: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      index: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
      index: true,
    },
    pincode: {
      type: String,
      default: '',
    },
    languages: [
      {
        type: String,
        trim: true,
      },
    ],
    consultationFee: {
      type: Number,
      default: 1000,
    },
    bio: {
      type: String,
      default: '',
    },
    profileImage: {
      type: String,
      default: '',
    },
    verified: {
      type: Boolean,
      default: true,
      index: true,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 15,
    },
    totalCasesHandled: {
      type: Number,
      default: 120,
    },
    onlineAvailable: {
      type: Boolean,
      default: true,
    },
    offlineAvailable: {
      type: Boolean,
      default: true,
    },
    vacationMode: {
      type: Boolean,
      default: false,
    },
    weeklySchedule: {
      type: Map,
      of: String,
      default: {
        Monday: '09:00 AM - 06:00 PM',
        Tuesday: '09:00 AM - 06:00 PM',
        Wednesday: '09:00 AM - 06:00 PM',
        Thursday: '09:00 AM - 06:00 PM',
        Friday: '09:00 AM - 06:00 PM',
        Saturday: '10:00 AM - 02:00 PM',
        Sunday: 'Closed',
      },
    },
    education: [
      {
        degree: String,
        institution: String,
        year: String,
      },
    ],
    achievements: [{ type: String, trim: true }],
    certifications: [{ type: String, trim: true }],
    courtExperience: [{ type: String, trim: true }],
    socialLinks: {
      linkedin: { type: String, default: '' },
      website: { type: String, default: '' },
    },
    profileViews: {
      type: Number,
      default: 142,
    },
  },
  {
    timestamps: true,
  }
)

// ─── Compound Indexes for Fast Search & Recommendation Queries ────────────────
advocateProfileSchema.index({ city: 1, state: 1, rating: -1 })
advocateProfileSchema.index({ practiceAreas: 1, city: 1 })
advocateProfileSchema.index({ experience: -1 })

const AdvocateProfile =
  mongoose.models.AdvocateProfile ||
  mongoose.model('AdvocateProfile', advocateProfileSchema)

export default AdvocateProfile
