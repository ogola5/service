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
  locationName: { type: String },
  postedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  budget: {
    min: { type: Number, min: 0 },
    max: {
      type: Number,
      validate: {
        validator: function (value) {
          return value >= this.budget.min;
        },
        message: 'Max budget must be greater than or equal to Min budget.'
      }
    }
  },
  duration: {
    type: String,
    enum: ['Hourly', 'Daily', 'Weekly', 'Monthly', 'Fixed'],
    default: 'Fixed'
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
    dateApplied: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['Pending', 'Shortlisted', 'Rejected'],
      default: 'Pending'
    }
  }],
  selectedProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// Create 2dsphere index for geospatial queries
jobSchema.index({ location: '2dsphere' });
jobSchema.index({ status: 1 });
jobSchema.index({ postedBy: 1 });

module.exports = mongoose.model('Job', jobSchema);
