const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true
  },
  serviceType: {
    type: String,
    enum: ['electrician', 'plumber', 'cleaner', 'gardener', 'painter', 'carpenter', 'mason', 'mechanic'],
    required: true
  },
  bookingDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'rejected'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  description: {
    type: String,
    required: [true, 'Please provide job description'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  requirements: {
    materialsNeeded: [{
      name: String,
      quantity: Number,
      unit: String,
      providedBy: {
        type: String,
        enum: ['customer', 'worker'],
        default: 'customer'
      }
    }],
    toolsNeeded: [{
      name: String,
      providedBy: {
        type: String,
        enum: ['customer', 'worker'],
        default: 'worker'
      }
    }],
    specialInstructions: String
  },
  location: {
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: 'India' }
    },
    coordinates: {
      lat: Number,
      lng: Number
    },
    accessInstructions: String,
    contactPerson: {
      name: String,
      phone: String
    }
  },
  pricing: {
    rateType: {
      type: String,
      enum: ['hourly', 'daily', 'fixed'],
      default: 'hourly'
    },
    baseRate: {
      type: Number,
      required: true
    },
    estimatedHours: Number,
    estimatedCost: Number,
    actualHours: Number,
    actualCost: Number,
    additionalCharges: [{
      description: String,
      amount: Number,
      approvedBy: {
        type: String,
        enum: ['customer', 'worker'],
        default: 'customer'
      }
    }],
    discount: {
      amount: Number,
      reason: String
    },
    totalAmount: Number,
    advanceAmount: Number,
    remainingAmount: Number
  },
  timeline: {
    requestedAt: {
      type: Date,
      default: Date.now
    },
    confirmedAt: Date,
    startedAt: Date,
    completedAt: Date,
    cancelledAt: Date,
    estimatedDuration: Number, // in hours
    actualDuration: Number // in hours
  },
  communication: {
    messages: [{
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      message: String,
      timestamp: {
        type: Date,
        default: Date.now
      },
      messageType: {
        type: String,
        enum: ['text', 'image', 'document', 'location'],
        default: 'text'
      },
      attachments: [String]
    }],
    lastMessageAt: Date
  },
  media: {
    beforeImages: [String],
    afterImages: [String],
    progressImages: [String],
    documents: [String]
  },
  feedback: {
    customerRating: {
      type: Number,
      min: 1,
      max: 5
    },
    customerReview: String,
    workerRating: {
      type: Number,
      min: 1,
      max: 5
    },
    workerReview: String,
    feedbackDate: Date
  },
  payment: {
    method: {
      type: String,
      enum: ['cash', 'card', 'upi', 'wallet', 'bank_transfer'],
      default: 'cash'
    },
    status: {
      type: String,
      enum: ['pending', 'partial', 'completed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAmount: {
      type: Number,
      default: 0
    },
    refundAmount: {
      type: Number,
      default: 0
    },
    paymentDate: Date,
    refundDate: Date
  },
  cancellation: {
    cancelledBy: {
      type: String,
      enum: ['customer', 'worker', 'system']
    },
    reason: String,
    cancellationFee: Number,
    refundAmount: Number,
    cancelledAt: Date
  },
  quality: {
    workQuality: {
      type: Number,
      min: 1,
      max: 5
    },
    timeliness: {
      type: Number,
      min: 1,
      max: 5
    },
    communication: {
      type: Number,
      min: 1,
      max: 5
    },
    cleanliness: {
      type: Number,
      min: 1,
      max: 5
    },
    overallSatisfaction: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  warranty: {
    provided: {
      type: Boolean,
      default: false
    },
    duration: Number, // in days
    terms: String,
    validUntil: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
bookingSchema.index({ customer: 1, status: 1 });
bookingSchema.index({ worker: 1, status: 1 });
bookingSchema.index({ bookingDate: 1 });
bookingSchema.index({ serviceType: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'location.coordinates': '2dsphere' });

// Virtual for duration calculation
bookingSchema.virtual('duration').get(function() {
  if (this.timeline.completedAt && this.timeline.startedAt) {
    return Math.round((this.timeline.completedAt - this.timeline.startedAt) / (1000 * 60 * 60)); // in hours
  }
  return null;
});

// Method to calculate total amount
bookingSchema.methods.calculateTotalAmount = function() {
  let total = this.pricing.baseRate;
  
  if (this.pricing.rateType === 'hourly' && this.pricing.actualHours) {
    total = this.pricing.baseRate * this.pricing.actualHours;
  } else if (this.pricing.rateType === 'hourly' && this.pricing.estimatedHours) {
    total = this.pricing.baseRate * this.pricing.estimatedHours;
  }
  
  // Add additional charges
  if (this.pricing.additionalCharges && this.pricing.additionalCharges.length > 0) {
    total += this.pricing.additionalCharges.reduce((sum, charge) => sum + charge.amount, 0);
  }
  
  // Apply discount
  if (this.pricing.discount && this.pricing.discount.amount) {
    total -= this.pricing.discount.amount;
  }
  
  this.pricing.totalAmount = total;
  this.pricing.remainingAmount = total - (this.pricing.advanceAmount || 0);
  
  return total;
};

// Method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function() {
  const now = new Date();
  const bookingDate = new Date(this.bookingDate);
  const timeDiff = bookingDate.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 3600);
  
  // Can cancel if booking is more than 2 hours away and status is pending or confirmed
  return hoursDiff > 2 && ['pending', 'confirmed'].includes(this.status);
};

// Method to add message
bookingSchema.methods.addMessage = function(senderId, message, messageType = 'text', attachments = []) {
  this.communication.messages.push({
    sender: senderId,
    message,
    messageType,
    attachments,
    timestamp: new Date()
  });
  this.communication.lastMessageAt = new Date();
};

// Pre-save middleware to calculate total amount
bookingSchema.pre('save', function(next) {
  if (this.isModified('pricing')) {
    this.calculateTotalAmount();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);