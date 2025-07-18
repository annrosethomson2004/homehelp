const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerType: {
    type: String,
    enum: ['worker', 'vendor', 'individual'],
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add tool name'],
    trim: true,
    maxlength: [100, 'Tool name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add tool description'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    enum: [
      'Power Tools',
      'Hand Tools', 
      'Measuring Tools',
      'Safety Equipment',
      'Ladders',
      'Cleaning Equipment',
      'Gardening Tools',
      'Welding Equipment',
      'Plumbing Tools',
      'Electrical Tools',
      'Carpentry Tools',
      'Painting Tools',
      'Masonry Tools',
      'Heavy Machinery'
    ],
    required: true
  },
  subcategory: {
    type: String,
    maxlength: [50, 'Subcategory cannot exceed 50 characters']
  },
  brand: {
    type: String,
    maxlength: [50, 'Brand name cannot exceed 50 characters']
  },
  model: {
    type: String,
    maxlength: [50, 'Model cannot exceed 50 characters']
  },
  specifications: {
    power: String,
    voltage: String,
    weight: String,
    dimensions: String,
    material: String,
    capacity: String,
    features: [String],
    technicalSpecs: mongoose.Schema.Types.Mixed
  },
  condition: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor'],
    required: true
  },
  conditionNotes: {
    type: String,
    maxlength: [300, 'Condition notes cannot exceed 300 characters']
  },
  pricing: {
    hourlyRate: {
      type: Number,
      min: [0, 'Hourly rate cannot be negative']
    },
    dailyRate: {
      type: Number,
      required: [true, 'Daily rate is required'],
      min: [0, 'Daily rate cannot be negative']
    },
    weeklyRate: {
      type: Number,
      min: [0, 'Weekly rate cannot be negative']
    },
    monthlyRate: {
      type: Number,
      min: [0, 'Monthly rate cannot be negative']
    },
    securityDeposit: {
      type: Number,
      required: [true, 'Security deposit is required'],
      min: [0, 'Security deposit cannot be negative']
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    availableFrom: {
      type: Date,
      default: Date.now
    },
    availableUntil: Date,
    unavailableDates: [{
      from: Date,
      to: Date,
      reason: String
    }],
    minimumRentalPeriod: {
      type: Number,
      default: 1, // in days
      min: [1, 'Minimum rental period must be at least 1 day']
    },
    maximumRentalPeriod: {
      type: Number,
      default: 30 // in days
    },
    advanceBookingDays: {
      type: Number,
      default: 7 // how many days in advance can be booked
    }
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
    deliveryRadius: {
      type: Number,
      default: 10 // in kilometers
    },
    pickupAvailable: {
      type: Boolean,
      default: true
    },
    deliveryAvailable: {
      type: Boolean,
      default: false
    },
    deliveryCharge: {
      type: Number,
      default: 0
    }
  },
  media: {
    images: [{
      url: String,
      caption: String,
      isPrimary: { type: Boolean, default: false }
    }],
    videos: [{
      url: String,
      caption: String,
      duration: Number
    }],
    documents: [{
      url: String,
      type: String, // manual, warranty, certificate
      name: String
    }]
  },
  maintenance: {
    lastServiceDate: Date,
    nextServiceDate: Date,
    serviceHistory: [{
      date: Date,
      type: String,
      description: String,
      cost: Number,
      servicedBy: String
    }],
    warrantyInfo: {
      hasWarranty: { type: Boolean, default: false },
      validUntil: Date,
      terms: String
    }
  },
  rental: {
    totalBookings: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    ratingCount: {
      type: Number,
      default: 0
    },
    lastRentedDate: Date,
    currentlyRented: {
      type: Boolean,
      default: false
    },
    currentRental: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ToolRental'
    }
  },
  safety: {
    requiresTraining: {
      type: Boolean,
      default: false
    },
    safetyInstructions: String,
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    requiredSafetyEquipment: [String],
    ageRestriction: {
      type: Number,
      default: 18
    }
  },
  insurance: {
    isCovered: {
      type: Boolean,
      default: false
    },
    provider: String,
    policyNumber: String,
    validUntil: Date,
    coverageAmount: Number
  },
  verification: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verificationDate: Date,
    verificationNotes: String
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  favorites: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
toolSchema.index({ owner: 1 });
toolSchema.index({ category: 1 });
toolSchema.index({ 'availability.isAvailable': 1 });
toolSchema.index({ 'pricing.dailyRate': 1 });
toolSchema.index({ 'location.coordinates': '2dsphere' });
toolSchema.index({ 'rental.averageRating': -1 });
toolSchema.index({ isActive: 1 });
toolSchema.index({ featured: -1 });
toolSchema.index({ tags: 1 });

// Virtual for primary image
toolSchema.virtual('primaryImage').get(function() {
  const primaryImg = this.media.images.find(img => img.isPrimary);
  return primaryImg ? primaryImg.url : (this.media.images[0] ? this.media.images[0].url : null);
});

// Method to check availability for specific dates
toolSchema.methods.isAvailableForDates = function(startDate, endDate) {
  if (!this.availability.isAvailable) return false;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Check if within available period
  if (this.availability.availableFrom && start < this.availability.availableFrom) return false;
  if (this.availability.availableUntil && end > this.availability.availableUntil) return false;
  
  // Check unavailable dates
  for (const unavailable of this.availability.unavailableDates) {
    if (start <= unavailable.to && end >= unavailable.from) {
      return false;
    }
  }
  
  return true;
};

// Method to calculate rental cost
toolSchema.methods.calculateRentalCost = function(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  
  let cost = 0;
  
  if (days >= 30 && this.pricing.monthlyRate) {
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    cost = (months * this.pricing.monthlyRate) + (remainingDays * this.pricing.dailyRate);
  } else if (days >= 7 && this.pricing.weeklyRate) {
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    cost = (weeks * this.pricing.weeklyRate) + (remainingDays * this.pricing.dailyRate);
  } else {
    cost = days * this.pricing.dailyRate;
  }
  
  return {
    days,
    rentalCost: cost,
    securityDeposit: this.pricing.securityDeposit,
    deliveryCharge: this.location.deliveryCharge || 0,
    totalCost: cost + this.pricing.securityDeposit + (this.location.deliveryCharge || 0)
  };
};

// Method to add rating
toolSchema.methods.addRating = function(rating) {
  const currentTotal = this.rental.averageRating * this.rental.ratingCount;
  this.rental.ratingCount += 1;
  this.rental.averageRating = (currentTotal + rating) / this.rental.ratingCount;
};

// Method to increment views
toolSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to toggle favorite
toolSchema.methods.toggleFavorite = function(userId) {
  const existingFavorite = this.favorites.find(fav => fav.user.toString() === userId.toString());
  
  if (existingFavorite) {
    this.favorites = this.favorites.filter(fav => fav.user.toString() !== userId.toString());
    return { action: 'removed', favorited: false };
  } else {
    this.favorites.push({ user: userId });
    return { action: 'added', favorited: true };
  }
};

module.exports = mongoose.model('Tool', toolSchema);