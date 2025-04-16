'use strict';

const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const app = express();
const config = require('../config/env');

// Import middleware
const { requestLogger, errorHandler, notFound } = require('../middleware/logger');
const { authMiddleware } = require('../middleware/auth');

// Base middleware
app.use(cors({
  origin: config.corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(requestLogger);

// Import routes
const authRoutes = require('./routes/auth');
const wasteRoutes = require('./routes/waste');
const locationRoutes = require('./routes/locations');
const userRoutes = require('./routes/users');

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

// Initialize local DynamoDB for development
if (config.nodeEnv === 'development' && !config.isServerless) {
  const dynamoLocal = require('../infrastructure/dynamodb-local');
  dynamoLocal.createLocalTables()
    .then(() => console.log('DynamoDB local initialized'))
    .catch(err => console.error('Error initializing DynamoDB local:', err));
}

// Export the serverless handler
module.exports.api = serverless(app);