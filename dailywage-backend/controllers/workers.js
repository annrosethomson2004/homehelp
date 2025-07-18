const { validationResult } = require('express-validator');
const Worker = require('../models/Worker');
const User = require('../models/User');
const Booking = require('../models/Booking');

// @desc    Get all workers
// @route   GET /api/workers
// @access  Public
exports.getWorkers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      service,
      minRate,
      maxRate,
      minRating,
      sortBy = 'ratings.average',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = { isActive: true };
    
    if (service) {
      query.services = { $in: [service] };
    }
    
    if (minRate || maxRate) {
      query.hourlyRate = {};
      if (minRate) query.hourlyRate.$gte = Number(minRate);
      if (maxRate) query.hourlyRate.$lte = Number(maxRate);
    }
    
    if (minRating) {
      query['ratings.average'] = { $gte: Number(minRating) };
    }

    // Execute query
    const workers = await Worker.find(query)
      .populate('userId', 'name email phone address profilePicture')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Worker.countDocuments(query);

    res.status(200).json({
      success: true,
      count: workers.length,
      total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      },
      data: workers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single worker
// @route   GET /api/workers/:id
// @access  Public
exports.getWorker = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id)
      .populate('userId', 'name email phone address profilePicture');

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    res.status(200).json({
      success: true,
      data: worker
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update worker profile
// @route   PUT /api/workers/profile
// @access  Private (Worker only)
exports.updateWorkerProfile = async (req, res, next) => {
  try {
    const {
      services,
      experience,
      hourlyRate,
      dailyRate,
      description,
      skills,
      certifications
    } = req.body;

    let worker = await Worker.findOne({ userId: req.user.id });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker profile not found'
      });
    }

    // Update fields
    if (services) worker.services = services;
    if (experience !== undefined) worker.experience = experience;
    if (hourlyRate !== undefined) worker.hourlyRate = hourlyRate;
    if (dailyRate !== undefined) worker.dailyRate = dailyRate;
    if (description) worker.description = description;
    if (skills) worker.skills = skills;
    if (certifications) worker.certifications = certifications;

    worker.lastActiveAt = new Date();

    await worker.save();

    res.status(200).json({
      success: true,
      data: worker
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update worker availability
// @route   PUT /api/workers/availability
// @access  Private (Worker only)
exports.updateAvailability = async (req, res, next) => {
  try {
    const { schedule, unavailableDates, workingRadius } = req.body;

    let worker = await Worker.findOne({ userId: req.user.id });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker profile not found'
      });
    }

    // Update availability
    if (schedule) worker.availability.schedule = schedule;
    if (unavailableDates) worker.availability.unavailableDates = unavailableDates;
    if (workingRadius !== undefined) worker.availability.workingRadius = workingRadius;

    worker.lastActiveAt = new Date();

    await worker.save();

    res.status(200).json({
      success: true,
      data: worker.availability
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get worker bookings
// @route   GET /api/workers/bookings/me
// @access  Private (Worker only)
exports.getWorkerBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const worker = await Worker.findOne({ userId: req.user.id });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker profile not found'
      });
    }

    // Build query
    let query = { worker: worker._id };
    
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('customer', 'name email phone address')
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

// @desc    Search workers
// @route   GET /api/workers/search
// @access  Public
exports.searchWorkers = async (req, res, next) => {
  try {
    const {
      q,
      lat,
      lng,
      radius = 10,
      service,
      minRate,
      maxRate,
      minRating,
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    let query = { isActive: true };
    let sort = {};

    // Text search
    if (q) {
      query.$or = [
        { description: { $regex: q, $options: 'i' } },
        { services: { $regex: q, $options: 'i' } }
      ];
    }

    // Service filter
    if (service) {
      query.services = { $in: [service] };
    }

    // Rate filter
    if (minRate || maxRate) {
      query.hourlyRate = {};
      if (minRate) query.hourlyRate.$gte = Number(minRate);
      if (maxRate) query.hourlyRate.$lte = Number(maxRate);
    }

    // Rating filter
    if (minRating) {
      query['ratings.average'] = { $gte: Number(minRating) };
    }

    // Location-based search
    if (lat && lng) {
      // First get users within radius
      const users = await User.find({
        'address.coordinates': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [Number(lng), Number(lat)]
            },
            $maxDistance: Number(radius) * 1000 // Convert km to meters
          }
        }
      });

      const userIds = users.map(user => user._id);
      query.userId = { $in: userIds };
      
      // Sort by distance (closest first)
      sort = { 'ratings.average': -1 };
    } else {
      // Sort by rating if no location
      sort = { 'ratings.average': -1 };
    }

    const workers = await Worker.find(query)
      .populate('userId', 'name email phone address profilePicture')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Worker.countDocuments(query);

    res.status(200).json({
      success: true,
      count: workers.length,
      total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      },
      data: workers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get worker stats
// @route   GET /api/workers/stats/me
// @access  Private (Worker only)
exports.getWorkerStats = async (req, res, next) => {
  try {
    const worker = await Worker.findOne({ userId: req.user.id });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker profile not found'
      });
    }

    // Get booking statistics
    const bookingStats = await Booking.aggregate([
      { $match: { worker: worker._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$pricing.totalAmount' }
        }
      }
    ]);

    // Get monthly earnings
    const monthlyEarnings = await Booking.aggregate([
      { 
        $match: { 
          worker: worker._id,
          status: 'completed',
          'timeline.completedAt': { $gte: new Date(new Date().getFullYear(), 0, 1) }
        }
      },
      {
        $group: {
          _id: { 
            year: { $year: '$timeline.completedAt' },
            month: { $month: '$timeline.completedAt' }
          },
          earnings: { $sum: '$pricing.totalAmount' },
          jobs: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        profile: worker.stats,
        bookings: bookingStats,
        monthlyEarnings,
        ratings: worker.ratings
      }
    });
  } catch (error) {
    next(error);
  }
};