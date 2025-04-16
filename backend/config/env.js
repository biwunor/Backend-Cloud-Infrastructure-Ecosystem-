'use strict';

/**
 * Configuration module for backend environment settings
 * Loads environment variables and provides defaults for development
 */

// Default configuration for development
const defaultConfig = {
  // Server settings
  PORT: 4000,
  NODE_ENV: 'development',
  
  // Database settings
  TABLE_NAME: 'uw-help-app-dev-waste-management',
  
  // AWS settings
  AWS_REGION: 'us-west-2',
  
  // Cors settings
  CORS_ORIGIN: '*',
  
  // Auth settings
  JWT_SECRET: 'dev-jwt-secret',
  JWT_EXPIRATION: '1d',
  
  // Logging
  LOG_LEVEL: 'debug'
};

/**
 * Load environment configuration
 * Uses environment variables when available, falls back to defaults
 */
function loadConfig() {
  // Only use default values in development
  if (process.env.NODE_ENV !== 'production') {
    // Set defaults for any environment variables that aren't defined
    Object.entries(defaultConfig).forEach(([key, value]) => {
      if (!process.env[key]) {
        process.env[key] = value.toString();
      }
    });
  }
  
  return {
    // Server settings
    port: process.env.PORT || defaultConfig.PORT,
    nodeEnv: process.env.NODE_ENV || defaultConfig.NODE_ENV,
    
    // Database settings
    tableName: process.env.TABLE_NAME || defaultConfig.TABLE_NAME,
    
    // AWS settings
    awsRegion: process.env.AWS_REGION || defaultConfig.AWS_REGION,
    
    // Cors settings
    corsOrigin: process.env.CORS_ORIGIN || defaultConfig.CORS_ORIGIN,
    
    // Auth settings
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: process.env.JWT_EXPIRATION || defaultConfig.JWT_EXPIRATION,
    
    // Logging
    logLevel: process.env.LOG_LEVEL || defaultConfig.LOG_LEVEL,
    
    // Determine if we're in a serverless environment
    isServerless: !!process.env.AWS_LAMBDA_FUNCTION_NAME,
    
    // API settings
    apiBasePath: process.env.API_BASE_PATH || '/api'
  };
}

module.exports = loadConfig();