import mongoose from 'mongoose';

const legalServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Legal service name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Government Legal Aid', 'DLSA', 'Helpline', 'NGO', 'Verified Advocate'],
      required: [true, 'Service type is required'],
    },
    category: {
      type: String,
      enum: [
        'Family Law',
        'Property Law',
        'Criminal Law',
        'Consumer Law',
        'Cyber Crime',
        'Employment',
        'Women Safety',
        'Senior Citizen',
        'Child Protection',
      ],
      required: [true, 'Legal category is required'],
    },
    description: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      index: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      index: true,
    },
    phone: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    workingHours: {
      type: String,
      default: '9:30 AM - 5:30 PM (Mon-Sat)',
    },
    verified: {
      type: Boolean,
      default: true,
    },
    latitude: {
      type: Number,
      default: 28.6139,
    },
    longitude: {
      type: Number,
      default: 77.209,
    },
  },
  {
    timestamps: true,
  }
);

// Search index on name, city, state, description
legalServiceSchema.index({ name: 'text', city: 'text', state: 'text', description: 'text' });

const LegalService = mongoose.model('LegalService', legalServiceSchema);

export default LegalService;
