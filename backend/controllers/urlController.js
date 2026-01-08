const { Url, User } = require('../models');
const { generateShortCode } = require('../utils/hashids');
const { validateUrl } = require('../utils/validation');

/**
 * Create shortened URL
 */
const shortenUrl = async (req, res) => {
  try {
    const { originalUrl, title } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!originalUrl) {
      return res.status(400).json({
        success: false,
        message: 'Original URL is required'
      });
    }

    if (!validateUrl(originalUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid URL with http:// or https://'
      });
    }

    // Check URL length
    if (originalUrl.length > 2048) {
      return res.status(400).json({
        success: false,
        message: 'URL is too long (maximum 2048 characters)'
      });
    }

    // Check user's URL limit (100 URLs max for free tier)
    const user = await User.findById(userId);
    if (user.urlCount >= 100) {
      return res.status(403).json({
        success: false,
        message: 'You have reached the maximum limit of 100 URLs. Please upgrade your plan to create more shortened URLs.',
        upgradeRequired: true
      });
    }

    // Check if URL already exists for this user
    const existingUrl = await Url.findOne({
      originalUrl,
      userId,
      isActive: true
    });

    if (existingUrl) {
      return res.status(200).json({
        success: true,
        message: 'URL already shortened',
        data: {
          id: existingUrl.id,
          originalUrl: existingUrl.originalUrl,
          shortCode: existingUrl.shortCode,
          shortUrl: `${process.env.BASE_URL}/${existingUrl.shortCode}`,
          title: existingUrl.title,
          clickCount: existingUrl.clickCount,
          createdAt: existingUrl.createdAt
        }
      });
    }

    // Generate a short ID for short code generation (use smaller number)
    const tempId = Date.now() % 1000000; // Use last 6 digits of timestamp
    const shortCode = generateShortCode(tempId);

    // Create URL record with the generated short code
    const url = new Url({
      originalUrl,
      title: title ? title.trim().substring(0, 200) : null,
      userId,
      shortCode
    });
    
    await url.save();

    // Increment user's URL count
    user.urlCount += 1;
    await user.save();

    res.status(201).json({
      success: true,
      message: 'URL shortened successfully',
      data: {
        id: url.id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
        title: url.title,
        clickCount: url.clickCount,
        createdAt: url.createdAt
      }
    });
  } catch (error) {
    console.error('URL shortening error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to shorten URL'
    });
  }
};

/**
 * Get user's shortened URLs for dashboard
 */
const getUserUrls = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;

    const skip = (page - 1) * limit;
    const sortOrder = order.toLowerCase() === 'asc' ? 1 : -1;

    const totalCount = await Url.countDocuments({
      userId,
      isActive: true
    });

    const urls = await Url.find({
      userId,
      isActive: true
    })
    .select('_id originalUrl shortCode title clickCount createdAt lastClickedAt')
    .sort({ [sort]: sortOrder })
    .skip(parseInt(skip))
    .limit(parseInt(limit))
    .lean();

    const urlsWithShortUrl = urls.map(url => ({
      ...url,
      id: url._id,
      shortUrl: `${process.env.BASE_URL}/${url.shortCode}`
    }));

    res.json({
      success: true,
      data: {
        urls: urlsWithShortUrl,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalUrls: totalCount,
          hasNext: parseInt(page) < Math.ceil(totalCount / limit),
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get user URLs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve URLs'
    });
  }
};

/**
 * Delete a shortened URL
 */
const deleteUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find URL
    const url = await Url.findOne({
      _id: id,
      userId,
      isActive: true
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found'
      });
    }

    // Soft delete the URL
    url.isActive = false;
    await url.save();

    // Decrement user's URL count
    const user = await User.findById(userId);
    if (user.urlCount > 0) {
      user.urlCount -= 1;
      await user.save();
    }

    res.json({
      success: true,
      message: 'URL deleted successfully'
    });
  } catch (error) {
    console.error('Delete URL error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete URL'
    });
  }
};

module.exports = {
  shortenUrl,
  getUserUrls,
  deleteUrl
};