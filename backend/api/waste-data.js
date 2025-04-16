'use strict';

const db = require('../database/db');

/**
 * Process waste data - runs on a scheduled basis
 * This function aggregates waste disposal data, generates reports,
 * and updates statistics for dashboard displays
 */
module.exports.process = async (event, context) => {
  try {
    console.log('Starting waste data processing job');
    
    // 1. Get all waste disposal data from the last period
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 1); // Last 24 hours
    
    const wasteData = await db.getWasteDataByDateRange(
      startDate.toISOString(),
      new Date().toISOString()
    );
    
    // 2. Calculate statistics
    const statistics = calculateStatistics(wasteData);
    
    // 3. Store processed statistics
    await db.saveWasteStatistics({
      id: new Date().toISOString(),
      statistics,
      createdAt: new Date().toISOString()
    });
    
    // 4. Generate impact metrics
    const impactMetrics = calculateImpactMetrics(wasteData);
    
    // 5. Update impact metrics
    await db.saveImpactMetrics({
      id: new Date().toISOString(),
      metrics: impactMetrics,
      createdAt: new Date().toISOString()
    });
    
    console.log('Completed waste data processing job successfully');
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Waste data processing completed successfully',
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error processing waste data:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error processing waste data',
        error: error.message
      })
    };
  }
};

/**
 * Calculate statistics based on waste data
 */
function calculateStatistics(wasteData) {
  // Group waste by type
  const wasteByType = wasteData.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = 0;
    }
    acc[item.type] += parseFloat(item.amount) || 0;
    return acc;
  }, {});
  
  // Calculate total waste
  const totalWaste = Object.values(wasteByType).reduce((sum, amount) => sum + amount, 0);
  
  // Calculate percentages
  const percentagesByType = {};
  Object.keys(wasteByType).forEach(type => {
    percentagesByType[type] = (wasteByType[type] / totalWaste) * 100;
  });
  
  return {
    totalWaste,
    wasteByType,
    percentagesByType
  };
}

/**
 * Calculate environmental impact metrics
 */
function calculateImpactMetrics(wasteData) {
  // Impact conversion factors (example values)
  const impactFactors = {
    plastic: { carbonSaved: 2.5, waterSaved: 10 },
    paper: { carbonSaved: 1.8, waterSaved: 5 },
    glass: { carbonSaved: 0.6, waterSaved: 2 },
    metal: { carbonSaved: 4.0, waterSaved: 7 },
    organic: { carbonSaved: 0.5, waterSaved: 1 }
  };
  
  // Calculate impact metrics
  let totalCarbonSaved = 0;
  let totalWaterSaved = 0;
  
  wasteData.forEach(item => {
    const amount = parseFloat(item.amount) || 0;
    const factors = impactFactors[item.type] || { carbonSaved: 0, waterSaved: 0 };
    
    totalCarbonSaved += amount * factors.carbonSaved;
    totalWaterSaved += amount * factors.waterSaved;
  });
  
  return {
    carbonSaved: totalCarbonSaved,
    waterSaved: totalWaterSaved,
    treesEquivalent: totalCarbonSaved / 21, // Approximation: 21kg CO2 per tree per year
    timestamp: new Date().toISOString()
  };
}