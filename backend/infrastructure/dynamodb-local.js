'use strict';

/**
 * Local DynamoDB setup for development and testing
 * This utility helps set up a local DynamoDB instance for dev/test environments
 */

const AWS = require('aws-sdk');
const config = require('../config/env');

// Configure AWS to use local DynamoDB in development
function configureDynamoDBLocal() {
  if (config.nodeEnv !== 'production') {
    console.log('Configuring DynamoDB local endpoint');
    // Configure AWS SDK to use local DynamoDB (typically running on port 8000)
    AWS.config.update({
      region: config.awsRegion,
      endpoint: 'http://localhost:8000'
    });
  } else {
    // Use standard AWS configuration for production
    AWS.config.update({
      region: config.awsRegion
    });
  }
  
  return new AWS.DynamoDB();
}

// Create tables for local development
async function createLocalTables() {
  if (config.nodeEnv !== 'production') {
    const dynamodb = configureDynamoDBLocal();
    
    // Create the table if it doesn't exist
    const params = {
      TableName: config.tableName,
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' }
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    };
    
    try {
      // Check if table already exists
      await dynamodb.describeTable({ TableName: config.tableName }).promise();
      console.log(`Table ${config.tableName} already exists`);
    } catch (error) {
      if (error.code === 'ResourceNotFoundException') {
        try {
          const result = await dynamodb.createTable(params).promise();
          console.log(`Created table ${config.tableName}:`, result);
        } catch (createError) {
          console.error('Error creating table:', createError);
        }
      } else {
        console.error('Error checking table:', error);
      }
    }
  }
}

// Export functions
module.exports = {
  configureDynamoDBLocal,
  createLocalTables
};