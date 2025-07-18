const { validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Worker = require('../models/Worker');
const Notification = require('../models/Notification');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check if worker exists and is available
    const worker = await Worker.findById(req.body.worker);
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    // Check worker availability for the requested time
    const bookingDate = new Date(req.body.bookingDate);
    const isAvailable = worker.isAvailableAt(bookingDate, req.body.timeSlot);
    
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Worker is not available at the requested time'
      });
    }

    // Create booking
    const booking = await Booking.create({
      ...req.body,
      customer: req.user.id
    });

    // Populate booking data
    await booking.populate([
      { path: 'customer', select: 'name email phone address' },
      { path: 'worker', populate: { path: 'userId', select: 'name email phone address' } }
    ]);

    // Send notification to worker
    await Notification.createAndSend({
      recipient: worker.userId,
      sender: req.user.id,
      type: 'booking',
      category: 'info',
      title: 'New Booking Request',
      message: `You have a new booking request for ${req.body.serviceType} service.`,
      data: { bookingId: booking._id },
      actionUrl: `/bookings/${booking._id}`,
      actionText: 'View Booking'
    });

    // Emit real-time notification
    const io = req.app.get('io');
    io.to(worker.userId.toString()).emit('booking-notification', {
      type: 'new-booking',
      booking: booking
    });

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Build query based on user type
    let query = {};
    if (req.user.userType === 'customer') {
      query.customer = req.user.id;
    } else if (req.user.userType === 'worker') {
      const worker = await Worker.findOne({ userId: req.user.id });
      if (!worker) {
        return res.status(404).json({
          success: false,
          message: 'Worker profile not found'
        });
      }
      query.worker = worker._id;
    }

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('customer', 'name email phone address')
      .populate({
        path: 'worker',
        populate: { path: 'userId', select: 'name email phone address' }
      })
      .sort({ bookingDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      },
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email phone address')
      .populate({
        path: 'worker',
        populate: { path: 'userId', select: 'name email phone address' }
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user has access to this booking
    const hasAccess = booking.customer._id.toString() === req.user.id ||
                     (booking.worker && booking.worker.userId._id.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    const worker = await Worker.findById(booking.worker);
    const hasAccess = booking.customer.toString() === req.user.id ||
                     (worker && worker.userId.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    const { status, pricing, timeline } = req.body;

    // Update allowed fields
    if (status) {
      booking.status = status;
      
      // Update timeline based on status
      if (status === 'confirmed') {
        booking.timeline.confirmedAt = new Date();
      } else if (status === 'in-progress') {
        booking.timeline.startedAt = new Date();
      } else if (status === 'completed') {
        booking.timeline.completedAt = new Date();
        booking.timeline.actualDuration = booking.duration;
      } else if (status === 'cancelled') {
        booking.timeline.cancelledAt = new Date();
      }
    }

    if (pricing) {
      Object.assign(booking.pricing, pricing);
    }

    if (timeline) {
      Object.assign(booking.timeline, timeline);
    }

    await booking.save();

    // Send notification to other party
    const recipientId = req.user.id === booking.customer.toString() ? 
                       worker.userId : booking.customer;

    await Notification.createAndSend({
      recipient: recipientId,
      sender: req.user.id,
      type: 'booking',
      category: 'info',
      title: 'Booking Updated',
      message: `Booking status has been updated to ${status}.`,
      data: { bookingId: booking._id },
      actionUrl: `/bookings/${booking._id}`,
      actionText: 'View Booking'
    });

    // Emit real-time notification
    const io = req.app.get('io');
    io.to(recipientId.toString()).emit('booking-notification', {
      type: 'booking-updated',
      booking: booking
    });

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if booking can be cancelled
    if (!booking.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled at this time'
      });
    }

    // Check authorization
    const worker = await Worker.findById(booking.worker);
    const hasAccess = booking.customer.toString() === req.user.id ||
                     (worker && worker.userId.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.timeline.cancelledAt = new Date();
    booking.cancellation = {
      cancelledBy: req.user.userType,
      reason: req.body.reason || 'No reason provided',
      cancelledAt: new Date()
    };

    await booking.save();

    // Send notification to other party
    const recipientId = req.user.id === booking.customer.toString() ? 
                       worker.userId : booking.customer;

    await Notification.createAndSend({
      recipient: recipientId,
      sender: req.user.id,
      type: 'booking',
      category: 'warning',
      title: 'Booking Cancelled',
      message: `Booking has been cancelled by ${req.user.userType}.`,
      data: { bookingId: booking._id },
      actionUrl: `/bookings/${booking._id}`,
      actionText: 'View Booking'
    });

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add feedback to booking
// @route   POST /api/bookings/:id/feedback
// @access  Private
exports.addFeedback = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Feedback can only be added to completed bookings'
      });
    }

    const { rating, review } = req.body;

    // Check authorization and update appropriate feedback
    const worker = await Worker.findById(booking.worker);
    
    if (booking.customer.toString() === req.user.id) {
      // Customer feedback about worker
      booking.feedback.customerRating = rating;
      booking.feedback.customerReview = review;
      booking.feedback.feedbackDate = new Date();

      // Update worker's rating
      if (worker) {
        worker.addRating(rating);
        await worker.save();
      }
    } else if (worker && worker.userId.toString() === req.user.id) {
      // Worker feedback about customer
      booking.feedback.workerRating = rating;
      booking.feedback.workerReview = review;
      booking.feedback.feedbackDate = new Date();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add feedback to this booking'
      });
    }

    await booking.save();

    res.status(200).json({
      success: true,
      data: booking.feedback
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking messages
// @route   GET /api/bookings/:id/messages
// @access  Private
exports.getBookingMessages = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('communication.messages.sender', 'name profilePicture');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    const worker = await Worker.findById(booking.worker);
    const hasAccess = booking.customer.toString() === req.user.id ||
                     (worker && worker.userId.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access these messages'
      });
    }

    res.status(200).json({
      success: true,
      data: booking.communication.messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add message to booking
// @route   POST /api/bookings/:id/messages
// @access  Private
exports.addMessage = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    const worker = await Worker.findById(booking.worker);
    const hasAccess = booking.customer.toString() === req.user.id ||
                     (worker && worker.userId.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send messages for this booking'
      });
    }

    const { message, messageType = 'text', attachments = [] } = req.body;

    // Add message
    booking.addMessage(req.user.id, message, messageType, attachments);
    await booking.save();

    // Send real-time message
    const io = req.app.get('io');
    const recipientId = req.user.id === booking.customer.toString() ? 
                       worker.userId : booking.customer;

    io.to(recipientId.toString()).emit('message-received', {
      bookingId: booking._id,
      sender: req.user.id,
      message,
      messageType,
      timestamp: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    next(error);
  }
};