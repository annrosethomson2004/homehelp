const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  services: [{
    type: String,
    enum: ['electrician', 'plumber', 'cleaner', 'gardener', 'painter', 'carpenter', 'mason', 'mechanic'],
    required: true
  }],
  experience: {
    type: Number,
    required: [true, 'Please add years of experience'],
    min: [0, 'Experience cannot be negative']
  },
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate'
    }
  }],
  hourlyRate: {
    type: Number,
    required: [true, 'Please add hourly rate'],
    min: [0, 'Rate cannot be negative']
  },
  dailyRate: {
    type: Number,
    required: [true, 'Please add daily rate'],
    min: [0, 'Rate cannot be negative']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  portfolio: [{
    title: String,
    description: String,
    images: [String],
    completedDate: Date
  }],
  certifications: [{
    name: String,
    issuer: String,
    issueDate: Date,
    expiryDate: Date,
    certificateUrl: String
  }],
  availability: {
    schedule: [{
      day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      },
      slots: [{
        startTime: String,
        endTime: String,
        isAvailable: { type: Boolean, default: true }
      }]
    }],
    unavailableDates: [Date],
    workingRadius: {
      type: Number,
      default: 10 // in kilometers
    }
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    },
    breakdown: {
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 }
    }
  },
  stats: {
    totalJobs: { type: Number, default: 0 },
    completedJobs: { type: Number, default: 0 },
    cancelledJobs: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    averageJobDuration: { type: Number, default: 0 },
    responseTime: { type: Number, default: 0 } // in minutes
  },
  verification: {
    isVerified: { type: Boolean, default: false },
    idProof: {
      type: String,
      url: String,
      verified: { type: Boolean, default: false }
    },
    addressProof: {
      type: String,
      url: String,
      verified: { type: Boolean, default: false }
    },
    skillCertificates: [{
      skill: String,
      url: String,
      verified: { type: Boolean, default: false }
    }],
    backgroundCheck: {
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      },
      completedAt: Date,
      reportUrl: String
    }
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,
    bankName: String,
    verified: { type: Boolean, default: false }
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastActiveAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for geospatial queries and performance
workerSchema.index({ 'userId': 1 });
workerSchema.index({ 'services': 1 });
workerSchema.index({ 'hourlyRate': 1 });
workerSchema.index({ 'ratings.average': -1 });
workerSchema.index({ 'isActive': 1 });

// Virtual for populated user data
workerSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Method to calculate average rating
workerSchema.methods.calculateAverageRating = function() {
  const breakdown = this.ratings.breakdown;
  const total = breakdown[5] + breakdown[4] + breakdown[3] + breakdown[2] + breakdown[1];
  
  if (total === 0) return 0;
  
  const sum = (breakdown[5] * 5) + (breakdown[4] * 4) + (breakdown[3] * 3) + (breakdown[2] * 2) + (breakdown[1] * 1);
  return (sum / total).toFixed(1);
};

// Method to add rating
workerSchema.methods.addRating = function(rating) {
  this.ratings.breakdown[rating]++;
  this.ratings.count++;
  this.ratings.average = this.calculateAverageRating();
};

// Method to check availability
workerSchema.methods.isAvailableAt = function(date, timeSlot) {
  // Check if date is in unavailable dates
  const unavailableDate = this.availability.unavailableDates.find(
    unavailableDate => unavailableDate.toDateString() === date.toDateString()
  );
  
  if (unavailableDate) return false;
  
  // Check day schedule
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const daySchedule = this.availability.schedule.find(schedule => schedule.day === dayName);
  
  if (!daySchedule) return false;
  
  // Check time slot availability
  return daySchedule.slots.some(slot => 
    slot.startTime <= timeSlot.startTime && 
    slot.endTime >= timeSlot.endTime && 
    slot.isAvailable
  );
};

module.exports = mongoose.model('Worker', workerSchema);