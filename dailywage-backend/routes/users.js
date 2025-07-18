const express = require('express');
const multer = require('multer');
const path = require('path');
const { body } = require('express-validator');
const {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAccount
} = require('../controllers/users');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// All routes are protected
router.use(protect);

// Profile validation
const profileValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('address').optional().isLength({ max: 200 }).withMessage('Address cannot exceed 200 characters')
];

// Routes
router.get('/profile', getProfile);
router.put('/profile', profileValidation, updateProfile);
router.post('/upload-avatar', upload.single('avatar'), uploadAvatar);
router.delete('/account', deleteAccount);

module.exports = router;