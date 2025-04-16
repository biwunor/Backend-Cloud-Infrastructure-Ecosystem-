'use strict';

/**
 * Helper utilities for backend operations
 * Provides common functions used across the backend
 */

/**
 * Calculate distance between two geographic coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in kilometers
  
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 * @param {number} degrees - Value in degrees
 * @returns {number} Value in radians
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Format date to ISO string with timezone
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  if (!date) return '';
  
  try {
    return new Date(date).toISOString();
  } catch (error) {
    return '';
  }
}

/**
 * Generate a random string for tokens, etc.
 * @param {number} length - Length of random string
 * @returns {string} Random string
 */
function generateRandomString(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Check if a string is a valid UUID
 * @param {string} str - String to check
 * @returns {boolean} True if valid UUID
 */
function isValidUUID(str) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Parse query parameters safely
 * @param {Object} query - Express query object
 * @param {string} key - Parameter key
 * @param {*} defaultValue - Default value if parameter is missing
 * @returns {*} Parameter value or default
 */
function parseQueryParam(query, key, defaultValue) {
  if (!query || !query[key]) {
    return defaultValue;
  }
  
  return query[key];
}

/**
 * Create a pagination object from query parameters
 * @param {Object} query - Express query object
 * @returns {Object} Pagination parameters
 */
function getPaginationParams(query) {
  const page = parseInt(parseQueryParam(query, 'page', 1));
  const limit = parseInt(parseQueryParam(query, 'limit', 10));
  
  return {
    page: page < 1 ? 1 : page,
    limit: limit < 1 ? 10 : (limit > 100 ? 100 : limit),
    offset: (page - 1) * limit
  };
}

module.exports = {
  calculateDistance,
  formatDate,
  generateRandomString,
  isValidUUID,
  parseQueryParam,
  getPaginationParams
};