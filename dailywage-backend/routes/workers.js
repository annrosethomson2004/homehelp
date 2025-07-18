const express = require('express');
const { body } = require('express-validator');
const {
  getWorkers,
  getWorker,
  updateWorkerProfile,
  updateAvailability,
  getWorkerBookings,
  searchWorkers,
  getWorkerStats
} = require('../controllers/workers');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getWorkers);
router.get('/search', searchWorkers);
router.get('/:id', getWorker);

// Protected routes
router.use(protect);

// Worker-only routes
router.put('/profile', authorize('worker'), updateWorkerProfile);
router.put('/availability', authorize('worker'), updateAvailability);
router.get('/bookings/me', authorize('worker'), getWorkerBookings);
router.get('/stats/me', authorize('worker'), getWorkerStats);

module.exports = router;