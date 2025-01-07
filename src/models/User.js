const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['job_seeker', 'employer'],
    required: true
  },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  },
  profile: {
    name: String,
    age: Number,
    bio: String
  },
  skills: [{
    name: { type: String, required: true },
    experience: { type: Number, default: 0 }
  }],
  availability: {
    days: [String], // e.g., ["Monday", "Tuesday"]
    hours: {
      start: String, // e.g., "09:00"
      end: String    // e.g., "17:00"
    }
  },
  pricing: {
    hourlyRate: Number,
    fixedRates: [{ task: String, price: Number }]
  },
  ratings: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    review: String,
    date: { type: Date, default: Date.now }
  }],
  certifications: [{
    name: String,
    issuingBody: String,
    date: Date
  }],
  portfolioItems: [{
    type: String, // URL or path to image/video
    description: String
  }]
}, { timestamps: true });

// Create 2dsphere index for geospatial queries
userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);