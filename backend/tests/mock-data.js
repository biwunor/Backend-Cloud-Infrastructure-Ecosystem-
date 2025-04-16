'use strict';

/**
 * Mock data for testing and development
 * Provides sample data structures for various entities
 */

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

/**
 * Generate mock waste items
 * @returns {Array} Array of mock waste items
 */
function generateMockWasteItems(count = 10) {
  const wasteTypes = ['plastic', 'paper', 'glass', 'metal', 'organic', 'electronic', 'hazardous'];
  const wasteItems = [];
  
  for (let i = 0; i < count; i++) {
    wasteItems.push({
      id: `waste#${uuidv4()}`,
      name: `Sample Waste Item ${i + 1}`,
      description: `This is a sample waste item for testing (${i + 1})`,
      type: wasteTypes[Math.floor(Math.random() * wasteTypes.length)],
      amount: parseFloat((Math.random() * 10).toFixed(2)),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString()
    });
  }
  
  return wasteItems;
}

/**
 * Generate mock disposal locations
 * @returns {Array} Array of mock locations
 */
function generateMockLocations(count = 5) {
  const locationTypes = ['recycling', 'composting', 'landfill', 'hazardous', 'electronic'];
  const locations = [];
  
  // UW Seattle area coordinates
  const baseLatitude = 47.655548;
  const baseLongitude = -122.308;
  
  for (let i = 0; i < count; i++) {
    // Generate locations within ~1km of the base location
    const lat = baseLatitude + (Math.random() - 0.5) * 0.01;
    const lng = baseLongitude + (Math.random() - 0.5) * 0.01;
    
    const type = locationTypes[Math.floor(Math.random() * locationTypes.length)];
    
    locations.push({
      id: `location#${uuidv4()}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Disposal Site ${i + 1}`,
      description: `A ${type} waste disposal site for testing`,
      type,
      coordinates: {
        latitude: lat,
        longitude: lng
      },
      address: `${Math.floor(1000 + Math.random() * 8999)} NE Campus Parkway, Seattle, WA 98105`,
      operatingHours: '8:00 AM - 6:00 PM',
      acceptedWaste: [type, locationTypes[Math.floor(Math.random() * locationTypes.length)]],
      createdAt: new Date().toISOString()
    });
  }
  
  return locations;
}

/**
 * Generate mock users
 * @returns {Array} Array of mock users
 */
async function generateMockUsers(count = 3) {
  const salt = await bcrypt.genSalt(10);
  const defaultPassword = await bcrypt.hash('Password123', salt);
  
  const users = [
    {
      id: `user#${uuidv4()}`,
      name: 'Admin User',
      email: 'admin@uw-waste-app.edu',
      password: defaultPassword,
      role: 'admin',
      preferences: {
        notifications: true,
        theme: 'dark'
      },
      createdAt: new Date().toISOString()
    },
    {
      id: `user#${uuidv4()}`,
      name: 'Test User',
      email: 'user@uw-waste-app.edu',
      password: defaultPassword,
      role: 'user',
      preferences: {
        notifications: true,
        theme: 'light'
      },
      createdAt: new Date().toISOString()
    }
  ];
  
  // Add additional random users if needed
  for (let i = 0; i < count - 2; i++) {
    users.push({
      id: `user#${uuidv4()}`,
      name: `User ${i + 3}`,
      email: `user${i + 3}@uw-waste-app.edu`,
      password: defaultPassword,
      role: 'user',
      preferences: {
        notifications: Math.random() > 0.5,
        theme: Math.random() > 0.5 ? 'light' : 'dark'
      },
      createdAt: new Date().toISOString()
    });
  }
  
  return users;
}

/**
 * Generate mock statistics
 * @returns {Object} Mock statistics object
 */
function generateMockStatistics() {
  const wasteTypes = ['plastic', 'paper', 'glass', 'metal', 'organic'];
  const wasteByType = {};
  let totalWaste = 0;
  
  // Generate random amounts for each waste type
  wasteTypes.forEach(type => {
    const amount = parseFloat((Math.random() * 1000).toFixed(2));
    wasteByType[type] = amount;
    totalWaste += amount;
  });
  
  // Calculate percentages
  const percentagesByType = {};
  Object.keys(wasteByType).forEach(type => {
    percentagesByType[type] = parseFloat(((wasteByType[type] / totalWaste) * 100).toFixed(2));
  });
  
  return {
    id: `stats#${new Date().toISOString()}`,
    statistics: {
      totalWaste,
      wasteByType,
      percentagesByType
    },
    createdAt: new Date().toISOString()
  };
}

/**
 * Generate mock impact metrics
 * @returns {Object} Mock impact metrics
 */
function generateMockImpactMetrics() {
  const carbonSaved = parseFloat((Math.random() * 5000).toFixed(2));
  const waterSaved = parseFloat((Math.random() * 10000).toFixed(2));
  
  return {
    id: `impact#${new Date().toISOString()}`,
    metrics: {
      carbonSaved,
      waterSaved,
      treesEquivalent: parseFloat((carbonSaved / 21).toFixed(2)),
      timestamp: new Date().toISOString()
    },
    createdAt: new Date().toISOString()
  };
}

module.exports = {
  generateMockWasteItems,
  generateMockLocations,
  generateMockUsers,
  generateMockStatistics,
  generateMockImpactMetrics
};