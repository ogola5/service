const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Invalid email format']
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    enum: ['job_seeker', 'employer'],
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(coords) {
          return coords.length === 2 &&
                 coords[0] >= -180 && coords[0] <= 180 &&
                 coords[1] >= -90 && coords[1] <= 90;
        },
        message: 'Coordinates must be valid latitude and longitude'
      }
    }
  },
  profile: {
    name: { type: String, default: '' },
    age: { type: Number },
    bio: { type: String, default: '' }
  },
  skills: [{
    name: { type: String, required: true },
    experience: { type: Number, default: 0 }
  }],
  availability: {
    days: { type: [String], default: [] },
    hours: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' }
    }
  },
  pricing: {
    hourlyRate: Number,
    fixedRates: [{ task: String, price: Number }]
  },
  ratings: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    review: String,
    date: { type: Date, default: Date.now }
  }],
  certifications: [{
    name: String,
    issuingBody: String,
    date: Date
  }],
  portfolioItems: [{
    type: { type: String, enum: ['image', 'video', 'link'], required: true },
    url: { type: String, required: true },
    description: String
  }],
  deleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Middleware for password hashing
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Create 2dsphere index for geospatial queries
userSchema.index({ location: '2dsphere' });
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);
