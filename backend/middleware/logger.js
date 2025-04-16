'use strict';

const config = require('../config/env');

/**
 * Logger middleware for API requests
 * Logs request details for debugging and monitoring
 */
function requestLogger(req, res, next) {
  // Skip logging in test environment
  if (config.nodeEnv === 'test') {
    return next();
  }
  
  const start = new Date();
  const { method, originalUrl, ip } = req;
  
  // Log request
  console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} - IP: ${ip}`);
  
  // Process request
  res.on('finish', () => {
    const duration = new Date() - start;
    const { statusCode } = res;
    
    // Log response
    if (statusCode >= 400) {
      console.error(`[${new Date().toISOString()}] ${method} ${originalUrl} - ${statusCode} - ${duration}ms`);
    } else {
      console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} - ${statusCode} - ${duration}ms`);
    }
  });
  
  next();
}

/**
 * Error handling middleware
 * Processes and standardizes error responses
 */
function errorHandler(err, req, res, next) {
  // Log the error
  console.error('[ERROR]', err);
  
  // Set default error status and message
  const status = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  
  // Format the error response
  const errorResponse = {
    error: true,
    message,
    ...(config.nodeEnv === 'development' && { stack: err.stack })
  };
  
  // Send error response
  res.status(status).json(errorResponse);
}

/**
 * Not found middleware
 * Handles requests to non-existent routes
 */
function notFound(req, res) {
  res.status(404).json({
    error: true,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
}

module.exports = {
  requestLogger,
  errorHandler,
  notFound
};