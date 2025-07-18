const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['booking', 'payment', 'reminder', 'general', 'promotion', 'system'],
    required: true
  },
  category: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info'
  },
  title: {
    type: String,
    required: [true, 'Please add notification title'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Please add notification message'],
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  actionUrl: {
    type: String
  },
  actionText: {
    type: String,
    maxlength: [50, 'Action text cannot exceed 50 characters']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  channels: {
    inApp: {
      type: Boolean,
      default: true
    },
    email: {
      type: Boolean,
      default: false
    },
    sms: {
      type: Boolean,
      default: false
    },
    push: {
      type: Boolean,
      default: false
    }
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'read', 'failed'],
    default: 'pending'
  },
  readAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  sentAt: {
    type: Date
  },
  scheduledFor: {
    type: Date
  },
  expiresAt: {
    type: Date
  },
  metadata: {
    deviceInfo: {
      type: String
    },
    ipAddress: {
      type: String
    },
    userAgent: {
      type: String
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
notificationSchema.index({ recipient: 1, status: 1 });
notificationSchema.index({ recipient: 1, type: 1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ status: 1 });
notificationSchema.index({ scheduledFor: 1 });
notificationSchema.index({ expiresAt: 1 });

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.status = 'read';
  this.readAt = new Date();
  return this.save();
};

// Method to mark as delivered
notificationSchema.methods.markAsDelivered = function() {
  this.status = 'delivered';
  this.deliveredAt = new Date();
  return this.save();
};

// Static method to create and send notification
notificationSchema.statics.createAndSend = async function(notificationData) {
  const notification = new this(notificationData);
  await notification.save();
  
  // Here you would integrate with actual notification services
  // For now, just mark as sent
  notification.status = 'sent';
  notification.sentAt = new Date();
  await notification.save();
  
  return notification;
};

// Static method to get unread count for user
notificationSchema.statics.getUnreadCount = async function(userId) {
  return await this.countDocuments({
    recipient: userId,
    status: { $in: ['sent', 'delivered'] }
  });
};

// Static method to mark all as read for user
notificationSchema.statics.markAllAsRead = async function(userId) {
  return await this.updateMany(
    { 
      recipient: userId, 
      status: { $in: ['sent', 'delivered'] } 
    },
    { 
      status: 'read', 
      readAt: new Date() 
    }
  );
};

module.exports = mongoose.model('Notification', notificationSchema);