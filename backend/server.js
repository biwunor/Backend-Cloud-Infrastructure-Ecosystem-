'use strict';

/**
 * Local development server for the backend
 * Provides a standalone Express server for development and testing
 */

const express = require('express');
const app = express();
const config = require('./config/env');

// Initialize DynamoDB Local if needed
if (config.nodeEnv === 'development') {
  const dynamoLocal = require('./infrastructure/dynamodb-local');
  dynamoLocal.createLocalTables()
    .then(() => console.log('DynamoDB local initialized'))
    .catch(err => console.error('Error initializing DynamoDB local:', err));
}

// Import middleware
const { requestLogger, errorHandler, notFound } = require('./middleware/logger');
const { authMiddleware } = require('./middleware/auth');

// Base middleware
app.use(express.json());
app.use(requestLogger);

// CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Import routes
const authRoutes = require('./api/routes/auth');
const wasteRoutes = require('./api/routes/waste');
const locationRoutes = require('./api/routes/locations');
const userRoutes = require('./api/routes/users');

// Public routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    environment: config.nodeEnv,
    timestamp: new Date().toISOString() 
  });
});

// Protected routes - require authentication
app.use('/api/waste', authMiddleware, wasteRoutes);
app.use('/api/locations', locationRoutes); // Public for viewing locations
app.use('/api/users', authMiddleware, userRoutes);

// Handle 404s
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = config.port || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
  console.log(`Health check available at http://localhost:${PORT}/api/health`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully');
  process.exit(0);
});