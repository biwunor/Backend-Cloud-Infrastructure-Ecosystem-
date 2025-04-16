'use strict';

/**
 * Validation utilities for backend data processing
 * Provides functions to validate and sanitize input data
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
function isValidEmail(email) {
  if (!email) return false;
  
  // Basic email regex pattern
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and message
 */
function validatePassword(password) {
  if (!password) {
    return {
      isValid: false,
      message: 'Password is required'
    };
  }
  
  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long'
    };
  }
  
  // Check for complexity
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  if (!(hasUpperCase && hasLowerCase && hasNumbers)) {
    return {
      isValid: false,
      message: 'Password must include uppercase, lowercase, and numbers'
    };
  }
  
  return {
    isValid: true,
    message: 'Password is valid'
  };
}

/**
 * Sanitize user input for security
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeInput(input) {
  if (!input || typeof input !== 'string') return '';
  
  // Replace potentially dangerous characters
  return input
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Validate coordinates (latitude and longitude)
 * @param {number} lat - Latitude value
 * @param {number} lng - Longitude value
 * @returns {boolean} True if valid coordinates
 */
function isValidCoordinates(lat, lng) {
  // Check if values are numbers
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return false;
  }
  
  // Check latitude range (-90 to 90)
  if (lat < -90 || lat > 90) {
    return false;
  }
  
  // Check longitude range (-180 to 180)
  if (lng < -180 || lng > 180) {
    return false;
  }
  
  return true;
}

/**
 * Validate waste item data
 * @param {Object} data - Waste item data
 * @returns {Object} Validation result
 */
function validateWasteItem(data) {
  const errors = {};
  
  // Validate required fields
  if (!data.name || data.name.trim() === '') {
    errors.name = 'Name is required';
  }
  
  if (!data.type || data.type.trim() === '') {
    errors.type = 'Type is required';
  }
  
  // Validate amount if present
  if (data.amount !== undefined && data.amount !== null) {
    if (isNaN(parseFloat(data.amount)) || parseFloat(data.amount) < 0) {
      errors.amount = 'Amount must be a positive number';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

module.exports = {
  isValidEmail,
  validatePassword,
  sanitizeInput,
  isValidCoordinates,
  validateWasteItem
};