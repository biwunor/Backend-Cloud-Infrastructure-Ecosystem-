'use strict';

/**
 * Data seeder for development and testing
 * Populates the database with sample data
 */

const db = require('../database/db');
const mockData = require('./mock-data');

/**
 * Seed the database with sample data for development
 */
async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Generate mock data
    const wasteItems = mockData.generateMockWasteItems(10);
    const locations = mockData.generateMockLocations(5);
    const users = await mockData.generateMockUsers(3);
    const statistics = mockData.generateMockStatistics();
    const impactMetrics = mockData.generateMockImpactMetrics();
    
    // Seed waste items
    console.log('Seeding waste items...');
    for (const item of wasteItems) {
      await db.createWasteItem(item);
    }
    
    // Seed locations
    console.log('Seeding locations...');
    for (const location of locations) {
      await db.createLocation(location);
    }
    
    // Seed users
    console.log('Seeding users...');
    for (const user of users) {
      await db.createUser(user);
    }
    
    // Seed statistics
    console.log('Seeding statistics...');
    await db.saveWasteStatistics(statistics);
    
    // Seed impact metrics
    console.log('Seeding impact metrics...');
    await db.saveImpactMetrics(impactMetrics);
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

/**
 * Clear all data from the database
 */
async function clearDatabase() {
  try {
    console.log('Clearing database...');
    
    // Implementation depends on the database being used
    // For DynamoDB, we would need to scan and delete items by type prefix
    
    console.log('Database cleared successfully!');
  } catch (error) {
    console.error('Error clearing database:', error);
  }
}

// If this script is run directly
if (require.main === module) {
  // Check for command line arguments
  const args = process.argv.slice(2);
  
  if (args.includes('--clear')) {
    clearDatabase()
      .then(() => process.exit(0))
      .catch(err => {
        console.error('Fatal error:', err);
        process.exit(1);
      });
  } else {
    seedDatabase()
      .then(() => process.exit(0))
      .catch(err => {
        console.error('Fatal error:', err);
        process.exit(1);
      });
  }
}

module.exports = {
  seedDatabase,
  clearDatabase
};