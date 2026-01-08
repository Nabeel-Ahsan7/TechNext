const validator = require('validator');

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Is valid email
 */
const validateEmail = (email) => {
  return validator.isEmail(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {boolean} - Is valid password
 */
const validatePassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - Is valid URL
 */
const validateUrl = (url) => {
  return validator.isURL(url, {
    protocols: ['http', 'https'],
    require_protocol: true
  });
};

/**
 * Sanitize string input
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
const sanitizeString = (input) => {
  return validator.escape(input.trim());
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUrl,
  sanitizeString
};