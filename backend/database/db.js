'use strict';

const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME || `uw-help-app-${process.env.NODE_ENV || 'dev'}-waste-management`;

// Waste Items
async function getAllWasteItems() {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: 'begins_with(id, :prefix)',
    ExpressionAttributeValues: {
      ':prefix': 'waste#'
    }
  };
  
  const result = await documentClient.scan(params).promise();
  return result.Items;
}

async function getWasteItemById(id) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: `waste#${id}`
    }
  };
  
  const result = await documentClient.get(params).promise();
  return result.Item;
}

async function createWasteItem(item) {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      ...item,
      id: `waste#${item.id}`
    }
  };
  
  return documentClient.put(params).promise();
}

async function updateWasteItem(id, item) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: `waste#${id}`
    },
    UpdateExpression: 'set #name = :name, description = :description, type = :type, amount = :amount, updatedAt = :updatedAt',
    ExpressionAttributeNames: {
      '#name': 'name'
    },
    ExpressionAttributeValues: {
      ':name': item.name,
      ':description': item.description,
      ':type': item.type,
      ':amount': item.amount,
      ':updatedAt': item.updatedAt
    },
    ReturnValues: 'ALL_NEW'
  };
  
  const result = await documentClient.update(params).promise();
  return result.Attributes;
}

async function deleteWasteItem(id) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: `waste#${id}`
    }
  };
  
  return documentClient.delete(params).promise();
}

// Waste Data
async function getWasteDataByDateRange(startDate, endDate) {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: 'begins_with(id, :prefix) AND createdAt BETWEEN :startDate AND :endDate',
    ExpressionAttributeValues: {
      ':prefix': 'waste#',
      ':startDate': startDate,
      ':endDate': endDate
    }
  };
  
  const result = await documentClient.scan(params).promise();
  return result.Items;
}

async function saveWasteStatistics(stats) {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      ...stats,
      id: `stats#${stats.id}`
    }
  };
  
  return documentClient.put(params).promise();
}

async function saveImpactMetrics(metrics) {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      ...metrics,
      id: `impact#${metrics.id}`
    }
  };
  
  return documentClient.put(params).promise();
}

// Locations
async function getAllLocations() {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: 'begins_with(id, :prefix)',
    ExpressionAttributeValues: {
      ':prefix': 'location#'
    }
  };
  
  const result = await documentClient.scan(params).promise();
  return result.Items;
}

async function getLocationsByType(type) {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: 'begins_with(id, :prefix) AND #type = :type',
    ExpressionAttributeNames: {
      '#type': 'type'
    },
    ExpressionAttributeValues: {
      ':prefix': 'location#',
      ':type': type
    }
  };
  
  const result = await documentClient.scan(params).promise();
  return result.Items;
}

async function getLocationById(id) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: `location#${id}`
    }
  };
  
  const result = await documentClient.get(params).promise();
  return result.Item;
}

async function createLocation(location) {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      ...location,
      id: `location#${location.id}`
    }
  };
  
  return documentClient.put(params).promise();
}

async function updateLocation(id, location) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: `location#${id}`
    },
    UpdateExpression: 'set #name = :name, description = :description, type = :type, coordinates = :coordinates, address = :address, operatingHours = :operatingHours, acceptedWaste = :acceptedWaste, updatedAt = :updatedAt',
    ExpressionAttributeNames: {
      '#name': 'name'
    },
    ExpressionAttributeValues: {
      ':name': location.name,
      ':description': location.description,
      ':type': location.type,
      ':coordinates': location.coordinates,
      ':address': location.address,
      ':operatingHours': location.operatingHours,
      ':acceptedWaste': location.acceptedWaste,
      ':updatedAt': location.updatedAt
    },
    ReturnValues: 'ALL_NEW'
  };
  
  const result = await documentClient.update(params).promise();
  return result.Attributes;
}

async function deleteLocation(id) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: `location#${id}`
    }
  };
  
  return documentClient.delete(params).promise();
}

// Users
async function getUserById(id) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: `user#${id}`
    }
  };
  
  const result = await documentClient.get(params).promise();
  return result.Item;
}

async function getUserByEmail(email) {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: 'begins_with(id, :prefix) AND email = :email',
    ExpressionAttributeValues: {
      ':prefix': 'user#',
      ':email': email
    }
  };
  
  const result = await documentClient.scan(params).promise();
  return result.Items[0]; // Return first match or undefined
}

async function createUser(user) {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      ...user,
      id: `user#${user.id}`
    }
  };
  
  return documentClient.put(params).promise();
}

async function updateUser(id, user) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: `user#${id}`
    },
    UpdateExpression: 'set #name = :name, email = :email, preferences = :preferences, updatedAt = :updatedAt',
    ExpressionAttributeNames: {
      '#name': 'name'
    },
    ExpressionAttributeValues: {
      ':name': user.name,
      ':email': user.email,
      ':preferences': user.preferences,
      ':updatedAt': user.updatedAt
    },
    ReturnValues: 'ALL_NEW'
  };
  
  const result = await documentClient.update(params).promise();
  return result.Attributes;
}

async function getUserActivity(userId) {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: 'begins_with(id, :prefix) AND userId = :userId',
    ExpressionAttributeValues: {
      ':prefix': 'activity#',
      ':userId': userId
    }
  };
  
  const result = await documentClient.scan(params).promise();
  return result.Items;
}

module.exports = {
  // Waste Items
  getAllWasteItems,
  getWasteItemById,
  createWasteItem,
  updateWasteItem,
  deleteWasteItem,
  
  // Waste Data
  getWasteDataByDateRange,
  saveWasteStatistics,
  saveImpactMetrics,
  
  // Locations
  getAllLocations,
  getLocationsByType,
  getLocationById,
  getNearbyLocations: () => [], // Placeholder - would be implemented with geospatial queries
  createLocation,
  updateLocation,
  deleteLocation,
  
  // Users
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  getUserActivity
};