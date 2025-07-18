const express = require('express');
const { body } = require('express-validator');
const {
  createBooking,
  getBookings,
  getBooking,
  updateBooking,
  cancelBooking,
  addFeedback,
  getBookingMessages,
  addMessage
} = require('../controllers/bookings');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Booking validation
const bookingValidation = [
  body('worker').isMongoId().withMessage('Valid worker ID is required'),
  body('serviceType').isIn(['electrician', 'plumber', 'cleaner', 'gardener', 'painter', 'carpenter', 'mason', 'mechanic']).withMessage('Valid service type is required'),
  body('bookingDate').isISO8601().withMessage('Valid booking date is required'),
  body('timeSlot.startTime').notEmpty().withMessage('Start time is required'),
  body('timeSlot.endTime').notEmpty().withMessage('End time is required'),
  body('description').isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('location.address').notEmpty().withMessage('Address is required'),
  body('pricing.baseRate').isNumeric().withMessage('Base rate must be a number')
];

// Routes
router.post('/', bookingValidation, createBooking);
router.get('/', getBookings);
router.get('/:id', getBooking);
router.put('/:id', updateBooking);
router.delete('/:id', cancelBooking);
router.post('/:id/feedback', addFeedback);
router.get('/:id/messages', getBookingMessages);
router.post('/:id/messages', addMessage);

module.exports = router;