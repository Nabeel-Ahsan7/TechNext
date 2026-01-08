const express = require('express');
const router = express.Router();
const { Url } = require('../models');
const { decodeShortCode, isValidShortCode } = require('../utils/hashids');

/**
 * Handle short URL redirects and track clicks
 */
const redirectToOriginalUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Validate short code format
    if (!isValidShortCode(shortCode)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid short URL format'
      });
    }

    // Decode short code to get original ID
    const urlId = decodeShortCode(shortCode);
    if (!urlId) {
      return res.status(404).json({
        success: false,
        message: 'Short URL not found'
      });
    }

    // Find URL in database
    const url = await Url.findOne({
      shortCode,
      isActive: true
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'Short URL not found or has been deleted'
      });
    }

    // Check if URL has expired
    if (url.expiresAt && new Date() > url.expiresAt) {
      return res.status(410).json({
        success: false,
        message: 'Short URL has expired'
      });
    }

    // Track click analytics
    url.clickCount += 1;
    url.lastClickedAt = new Date();
    await url.save();

    // Redirect to original URL
    res.redirect(301, url.originalUrl);
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({
      success: false,
      message: 'Redirect failed'
    });
  }
};

// Handle short code redirects (e.g., /abc123)
router.get('/:shortCode', redirectToOriginalUrl);

module.exports = router;