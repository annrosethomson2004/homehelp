const express = require('express');
const { body } = require('express-validator');
const {
  getTools,
  getTool,
  createTool,
  updateTool,
  deleteTool,
  searchTools,
  toggleFavorite,
  rentTool
} = require('../controllers/tools');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes with optional auth
router.get('/', optionalAuth, getTools);
router.get('/search', optionalAuth, searchTools);
router.get('/:id', optionalAuth, getTool);

// Protected routes
router.use(protect);

// Tool validation
const toolValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Tool name must be between 2 and 100 characters'),
  body('description').isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
  body('category').isIn([
    'Power Tools', 'Hand Tools', 'Measuring Tools', 'Safety Equipment',
    'Ladders', 'Cleaning Equipment', 'Gardening Tools', 'Welding Equipment',
    'Plumbing Tools', 'Electrical Tools', 'Carpentry Tools', 'Painting Tools',
    'Masonry Tools', 'Heavy Machinery'
  ]).withMessage('Invalid tool category'),
  body('condition').isIn(['excellent', 'good', 'fair', 'poor']).withMessage('Invalid condition'),
  body('pricing.dailyRate').isNumeric().withMessage('Daily rate must be a number'),
  body('pricing.securityDeposit').isNumeric().withMessage('Security deposit must be a number')
];

// Routes
router.post('/', toolValidation, createTool);
router.put('/:id', updateTool);
router.delete('/:id', deleteTool);
router.post('/:id/favorite', toggleFavorite);
router.post('/:id/rent', rentTool);

module.exports = router;