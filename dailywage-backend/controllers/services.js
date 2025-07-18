const Worker = require('../models/Worker');
const Booking = require('../models/Booking');

// @desc    Get services overview
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res, next) => {
  try {
    const services = [
      {
        id: 'electrician',
        name: 'Electrician',
        description: 'Electrical repairs, installations, and maintenance',
        icon: '⚡',
        averageRate: 500,
        workersCount: 0,
        completedJobs: 0
      },
      {
        id: 'plumber',
        name: 'Plumber',
        description: 'Plumbing repairs, installations, and maintenance',
        icon: '🔧',
        averageRate: 450,
        workersCount: 0,
        completedJobs: 0
      },
      {
        id: 'cleaner',
        name: 'Cleaner',
        description: 'House cleaning and maintenance services',
        icon: '🧹',
        averageRate: 300,
        workersCount: 0,
        completedJobs: 0
      },
      {
        id: 'gardener',
        name: 'Gardener',
        description: 'Garden maintenance and landscaping',
        icon: '🌱',
        averageRate: 350,
        workersCount: 0,
        completedJobs: 0
      },
      {
        id: 'painter',
        name: 'Painter',
        description: 'Interior and exterior painting services',
        icon: '🎨',
        averageRate: 400,
        workersCount: 0,
        completedJobs: 0
      },
      {
        id: 'carpenter',
        name: 'Carpenter',
        description: 'Woodworking and furniture repair',
        icon: '🔨',
        averageRate: 550,
        workersCount: 0,
        completedJobs: 0
      },
      {
        id: 'mason',
        name: 'Mason',
        description: 'Brick and stone work, construction',
        icon: '🧱',
        averageRate: 600,
        workersCount: 0,
        completedJobs: 0
      },
      {
        id: 'mechanic',
        name: 'Mechanic',
        description: 'Vehicle and machinery repair',
        icon: '🔧',
        averageRate: 700,
        workersCount: 0,
        completedJobs: 0
      }
    ];

    // Get actual statistics for each service
    for (let service of services) {
      // Count workers for this service
      const workersCount = await Worker.countDocuments({
        services: service.id,
        isActive: true
      });

      // Count completed jobs for this service
      const completedJobs = await Booking.countDocuments({
        serviceType: service.id,
        status: 'completed'
      });

      // Calculate average rate for this service
      const workers = await Worker.find({
        services: service.id,
        isActive: true
      });

      if (workers.length > 0) {
        const totalRate = workers.reduce((sum, worker) => sum + worker.hourlyRate, 0);
        service.averageRate = Math.round(totalRate / workers.length);
      }

      service.workersCount = workersCount;
      service.completedJobs = completedJobs;
    }

    res.status(200).json({
      success: true,
      data: services
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get service categories
// @route   GET /api/services/categories
// @access  Public
exports.getServiceCategories = async (req, res, next) => {
  try {
    const categories = [
      'electrician',
      'plumber',
      'cleaner',
      'gardener',
      'painter',
      'carpenter',
      'mason',
      'mechanic'
    ];

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get service statistics
// @route   GET /api/services/stats
// @access  Public
exports.getServiceStats = async (req, res, next) => {
  try {
    // Get overall statistics
    const totalWorkers = await Worker.countDocuments({ isActive: true });
    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const activeBookings = await Booking.countDocuments({ 
      status: { $in: ['pending', 'confirmed', 'in-progress'] } 
    });

    // Get service-wise statistics
    const serviceStats = await Booking.aggregate([
      {
        $group: {
          _id: '$serviceType',
          totalBookings: { $sum: 1 },
          completedBookings: { 
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } 
          },
          averageRating: { $avg: '$feedback.customerRating' },
          totalRevenue: { 
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$pricing.totalAmount', 0] } 
          }
        }
      },
      {
        $sort: { totalBookings: -1 }
      }
    ]);

    // Get monthly booking trends
    const monthlyStats = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          bookings: { $sum: 1 },
          completedBookings: { 
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } 
          },
          revenue: { 
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$pricing.totalAmount', 0] } 
          }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalWorkers,
          totalBookings,
          completedBookings,
          activeBookings,
          successRate: totalBookings > 0 ? ((completedBookings / totalBookings) * 100).toFixed(1) : 0
        },
        serviceStats,
        monthlyStats
      }
    });
  } catch (error) {
    next(error);
  }
};