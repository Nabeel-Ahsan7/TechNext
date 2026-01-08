const express = require('express');
const router = express.Router();
const { shortenUrl, getUserUrls, deleteUrl } = require('../controllers/urlController');
const { authenticateToken } = require('../middleware/auth');

// All URL routes require authentication
router.use(authenticateToken);

// URL management routes
router.post('/shorten', shortenUrl);
router.get('/dashboard', getUserUrls);
router.delete('/:id', deleteUrl);

module.exports = router;