const { validationResult } = require('express-validator');
const User = require('../models/User');
const Worker = require('../models/Worker');
const Booking = require('../models/Booking');
const fs = require('fs');
const path = require('path');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    let userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      userType: user.userType,
      profilePicture: user.profilePicture,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      preferences: user.preferences,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    };

    // If user is a worker, get worker profile
    if (user.userType === 'worker') {
      const workerProfile = await Worker.findOne({ userId: user._id });
      if (workerProfile) {
        userData.workerProfile = workerProfile;
      }
    }

    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
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

    const { name, phone, address, preferences } = req.body;

    const user = await User.findById(req.user.id);

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) {
      if (typeof address === 'string') {
        user.address = { street: address };
      } else {
        user.address = { ...user.address, ...address };
      }
    }
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        userType: user.userType,
        profilePicture: user.profilePicture,
        preferences: user.preferences
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload user avatar
// @route   POST /api/users/upload-avatar
// @access  Private
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    const user = await User.findById(req.user.id);

    // Delete old avatar if exists
    if (user.profilePicture) {
      const oldAvatarPath = path.join(__dirname, '..', user.profilePicture);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Update user with new avatar path
    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    user.profilePicture = avatarPath;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        profilePicture: avatarPath
      }
    });
  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file) {
      const filePath = path.join(__dirname, '..', 'uploads', 'avatars', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    next(error);
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
exports.deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    // Check if user has any active bookings
    const activeBookings = await Booking.countDocuments({
      $or: [
        { customer: req.user.id },
        { worker: req.user.id }
      ],
      status: { $in: ['pending', 'confirmed', 'in-progress'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete account with active bookings. Please complete or cancel all active bookings first.'
      });
    }

    // Delete worker profile if exists
    if (user.userType === 'worker') {
      await Worker.findOneAndDelete({ userId: req.user.id });
    }

    // Delete profile picture if exists
    if (user.profilePicture) {
      const avatarPath = path.join(__dirname, '..', user.profilePicture);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    // Soft delete user (mark as inactive)
    user.isActive = false;
    user.email = `deleted_${Date.now()}_${user.email}`;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};