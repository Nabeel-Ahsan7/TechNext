const Hashids = require('hashids/cjs');

const hashids = new Hashids(
  process.env.HASHIDS_SALT || 'url-shortener-salt-2024',
  parseInt(process.env.HASHIDS_MIN_LENGTH) || 6,
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
);

/**
 * Generate short code from auto-increment ID
 * @param {number} id - Database auto-increment ID
 * @returns {string} - 6-8 character short code
 */
const generateShortCode = (id) => {
  return hashids.encode(id);
};

/**
 * Decode short code back to original ID
 * @param {string} shortCode - 6-8 character short code
 * @returns {number} - Original database ID
 */
const decodeShortCode = (shortCode) => {
  const decoded = hashids.decode(shortCode);
  return decoded.length > 0 ? decoded[0] : null;
};

/**
 * Validate short code format
 * @param {string} shortCode - Short code to validate
 * @returns {boolean} - Is valid format
 */
const isValidShortCode = (shortCode) => {
  return typeof shortCode === 'string' && 
         shortCode.length >= 6 && 
         shortCode.length <= 8 &&
         /^[a-zA-Z0-9]+$/.test(shortCode);
};

module.exports = {
  generateShortCode,
  decodeShortCode,
  isValidShortCode
};