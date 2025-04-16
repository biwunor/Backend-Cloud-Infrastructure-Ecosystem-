'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config/env');

/**
 * Authentication middleware for protecting API routes
 * Verifies JWT tokens and adds user information to request
 */
function authMiddleware(req, res, next) {
  // Get token from authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  try {
    // Verify the token
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Add user data to request
    req.user = decoded;
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    return res.status(403).json({ message: 'Invalid token' });
  }
}

/**
 * Role-based authorization middleware
 * @param {string[]} roles - Array of allowed roles
 */
function authorizeRoles(roles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    
    next();
  };
}

// Generate JWT token for user
function generateToken(user) {
  // Remove sensitive information
  const { password, ...userWithoutPassword } = user;
  
  // Sign and return token
  return jwt.sign(userWithoutPassword, config.jwtSecret, {
    expiresIn: config.jwtExpiration
  });
}

module.exports = {
  authMiddleware,
  authorizeRoles,
  generateToken
};