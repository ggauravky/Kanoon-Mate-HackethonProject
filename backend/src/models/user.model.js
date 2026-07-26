import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Never return password in queries by default
    },
    phone: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: 'Delhi',
      index: true,
    },
    city: {
      type: String,
      default: 'Delhi',
      index: true,
    },
    pincode: {
      type: String,
      default: '',
    },
    preferredLanguage: {
      type: String,
      default: 'English',
    },
    gender: {
      type: String,
      default: '',
    },
    profilePicture: {
      type: String,
      default: '',
    },
    profilePicturePublicId: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['citizen', 'law_student', 'advocate', 'admin', 'super_admin'],
      default: 'citizen',
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    favoriteAdvocates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdvocateProfile',
      },
    ],
  },
  {
    timestamps: true,
  }
)

// ─── Indexes ────────────────────────────────────────────────────────────────
userSchema.index({ createdAt: -1 })
userSchema.index({ role: 1 })
userSchema.index({ city: 1, state: 1 })

// ─── Pre-Save Hook: Hash Password with bcryptjs ──────────────────────────────
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// ─── Instance Method: Compare Password ────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// ─── Instance Method: Generate JWT Token ──────────────────────────────────────
userSchema.methods.generateAuthToken = function () {
  const secret = process.env.JWT_SECRET || 'kanoon_mate_super_secret_jwt_key_2026_change_in_production'
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d'

  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
    },
    secret,
    { expiresIn }
  )
}

const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User
