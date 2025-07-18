const express = require('express');
const {
  getServices,
  getServiceCategories,
  getServiceStats
} = require('../controllers/services');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes with optional auth
router.get('/', optionalAuth, getServices);
router.get('/categories', getServiceCategories);
router.get('/stats', getServiceStats);

module.exports = router;