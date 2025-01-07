const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skillsRequired: [{ type: String, required: true }],
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  },
  postedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  budget: {
    min: Number,
    max: Number
  },
  duration: {
    type: String,
    enum: ['Hourly', 'Daily', 'Weekly', 'Monthly', 'Fixed']
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Open'
  },
  applicants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pitch: String,
    rate: Number,
    dateApplied: { type: Date, default: Date.now }
  }],
  selectedProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// Create 2dsphere index for geospatial queries
jobSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Job', jobSchema);