const { validationResult } = require('express-validator');
const Tool = require('../models/Tool');
const User = require('../models/User');

// @desc    Get all tools
// @route   GET /api/tools
// @access  Public
exports.getTools = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      condition,
      minPrice,
      maxPrice,
      location,
      radius = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (condition) {
      query.condition = condition;
    }

    if (minPrice || maxPrice) {
      query['pricing.dailyRate'] = {};
      if (minPrice) query['pricing.dailyRate'].$gte = Number(minPrice);
      if (maxPrice) query['pricing.dailyRate'].$lte = Number(maxPrice);
    }

    // Location-based filtering
    if (location) {
      // This would require geocoding the location string
      // For now, we'll skip this feature
    }

    // Execute query
    const tools = await Tool.find(query)
      .populate('owner', 'name email phone profilePicture')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Tool.countDocuments(query);

    // Add favorite status for authenticated users
    if (req.user) {
      tools.forEach(tool => {
        tool.isFavorited = tool.favorites.some(fav => fav.user.toString() === req.user.id);
      });
    }

    res.status(200).json({
      success: true,
      count: tools.length,
      total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      },
      data: tools
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single tool
// @route   GET /api/tools/:id
// @access  Public
exports.getTool = async (req, res, next) => {
  try {
    const tool = await Tool.findById(req.params.id)
      .populate('owner', 'name email phone profilePicture address');

    if (!tool) {
      return res.status(404).json({
        success: false,
        message: 'Tool not found'
      });
    }

    // Increment view count
    await tool.incrementViews();

    // Add favorite status for authenticated users
    if (req.user) {
      tool.isFavorited = tool.favorites.some(fav => fav.user.toString() === req.user.id);
    }

    res.status(200).json({
      success: true,
      data: tool
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new tool
// @route   POST /api/tools
// @access  Private
exports.createTool = async (req, res, next) => {
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

    // Add owner to tool data
    const toolData = {
      ...req.body,
      owner: req.user.id,
      ownerType: req.user.userType === 'worker' ? 'worker' : 'individual'
    };

    const tool = await Tool.create(toolData);

    res.status(201).json({
      success: true,
      data: tool
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update tool
// @route   PUT /api/tools/:id
// @access  Private
exports.updateTool = async (req, res, next) => {
  try {
    let tool = await Tool.findById(req.params.id);

    if (!tool) {
      return res.status(404).json({
        success: false,
        message: 'Tool not found'
      });
    }

    // Check ownership
    if (tool.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this tool'
      });
    }

    tool = await Tool.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: tool
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete tool
// @route   DELETE /api/tools/:id
// @access  Private
exports.deleteTool = async (req, res, next) => {
  try {
    const tool = await Tool.findById(req.params.id);

    if (!tool) {
      return res.status(404).json({
        success: false,
        message: 'Tool not found'
      });
    }

    // Check ownership
    if (tool.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this tool'
      });
    }

    // Check if tool is currently rented
    if (tool.rental.currentlyRented) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete tool that is currently rented'
      });
    }

    // Soft delete (mark as inactive)
    tool.isActive = false;
    await tool.save();

    res.status(200).json({
      success: true,
      message: 'Tool deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search tools
// @route   GET /api/tools/search
// @access  Public
exports.searchTools = async (req, res, next) => {
  try {
    const {
      q,
      category,
      condition,
      minPrice,
      maxPrice,
      lat,
      lng,
      radius = 10,
      page = 1,
      limit = 12
    } = req.query;

    // Build query
    let query = { isActive: true };

    // Text search
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Condition filter
    if (condition) {
      query.condition = condition;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query['pricing.dailyRate'] = {};
      if (minPrice) query['pricing.dailyRate'].$gte = Number(minPrice);
      if (maxPrice) query['pricing.dailyRate'].$lte = Number(maxPrice);
    }

    // Location-based search
    let sort = { 'rental.averageRating': -1 };
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
      query.owner = { $in: userIds };
    }

    const tools = await Tool.find(query)
      .populate('owner', 'name email phone profilePicture address')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Tool.countDocuments(query);

    // Add favorite status for authenticated users
    if (req.user) {
      tools.forEach(tool => {
        tool.isFavorited = tool.favorites.some(fav => fav.user.toString() === req.user.id);
      });
    }

    res.status(200).json({
      success: true,
      count: tools.length,
      total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      },
      data: tools
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle tool favorite
// @route   POST /api/tools/:id/favorite
// @access  Private
exports.toggleFavorite = async (req, res, next) => {
  try {
    const tool = await Tool.findById(req.params.id);

    if (!tool) {
      return res.status(404).json({
        success: false,
        message: 'Tool not found'
      });
    }

    const result = tool.toggleFavorite(req.user.id);
    await tool.save();

    res.status(200).json({
      success: true,
      message: `Tool ${result.action} ${result.favorited ? 'to' : 'from'} favorites`,
      data: {
        favorited: result.favorited,
        favoritesCount: tool.favorites.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Rent tool
// @route   POST /api/tools/:id/rent
// @access  Private
exports.rentTool = async (req, res, next) => {
  try {
    const tool = await Tool.findById(req.params.id);

    if (!tool) {
      return res.status(404).json({
        success: false,
        message: 'Tool not found'
      });
    }

    // Check if user is trying to rent their own tool
    if (tool.owner.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot rent your own tool'
      });
    }

    const { startDate, endDate } = req.body;

    // Check availability
    if (!tool.isAvailableForDates(startDate, endDate)) {
      return res.status(400).json({
        success: false,
        message: 'Tool is not available for the selected dates'
      });
    }

    // Calculate rental cost
    const costBreakdown = tool.calculateRentalCost(startDate, endDate);

    // Here you would typically create a rental booking
    // For now, we'll just return the cost breakdown
    res.status(200).json({
      success: true,
      message: 'Rental cost calculated successfully',
      data: {
        tool: {
          id: tool._id,
          name: tool.name,
          owner: tool.owner
        },
        rental: {
          startDate,
          endDate,
          ...costBreakdown
        }
      }
    });
  } catch (error) {
    next(error);
  }
};