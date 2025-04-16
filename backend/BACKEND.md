# UW Waste Management Backend Infrastructure

This document provides an overview of the backend infrastructure for the University of Washington Waste Management application.

## Architecture Overview

The backend is designed as a serverless application using AWS Lambda and API Gateway, with DynamoDB as the database. This architecture provides the following benefits:

- **Scalability**: Automatically scales based on request volume
- **Cost-Efficiency**: Pay only for what you use (no idle server costs)
- **Maintenance**: Reduced operational overhead
- **Security**: Managed authentication and authorization

## Directory Structure

```
backend/
├── api/                # API implementation
│   ├── handler.js      # Main serverless handler
│   ├── waste-data.js   # Scheduled tasks for waste data processing
│   └── routes/         # API route handlers
├── config/             # Configuration files
│   └── env.js          # Environment configuration
├── database/           # Database interface
│   └── db.js           # DynamoDB interface
├── infrastructure/     # Infrastructure configurations
│   ├── serverless.yml  # Serverless Framework configuration
│   └── dynamodb-local.js # Local DynamoDB setup
├── middleware/         # Express middleware
│   ├── auth.js         # Authentication middleware
│   └── logger.js       # Logging and error handling
├── tests/              # Testing utilities
│   ├── mock-data.js    # Mock data generators
│   └── seed-data.js    # Database seeding script
├── utils/              # Utility functions
│   ├── helpers.js      # Common helper functions
│   └── validation.js   # Data validation functions
├── .env.example        # Example environment variables
├── BACKEND.md          # Backend documentation
└── server.js           # Local development server
```

## API Endpoints

The API provides the following endpoints:

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate a user
- `GET /api/auth/me` - Get current user information

### Waste Management

- `GET /api/waste` - Get all waste items
- `GET /api/waste/:id` - Get waste item by ID
- `POST /api/waste` - Create a new waste item
- `PUT /api/waste/:id` - Update a waste item
- `DELETE /api/waste/:id` - Delete a waste item

### Locations

- `GET /api/locations` - Get all disposal locations
- `GET /api/locations/type/:type` - Get locations by type
- `GET /api/locations/:id` - Get location by ID
- `GET /api/locations/nearby` - Get locations by proximity
- `POST /api/locations` - Create a new location
- `PUT /api/locations/:id` - Update a location
- `DELETE /api/locations/:id` - Delete a location

### Users

- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `GET /api/users/:id/activity` - Get user activity
- `PUT /api/users/:id/preferences` - Update user preferences

## Database Schema

The application uses DynamoDB with the following primary structures:

### Waste Items
```
{
  id: "waste#<uuid>",
  name: String,
  description: String,
  type: String,
  amount: Number,
  createdAt: ISOString,
  updatedAt: ISOString
}
```

### Locations
```
{
  id: "location#<uuid>",
  name: String,
  description: String,
  type: String,
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  address: String,
  operatingHours: String,
  acceptedWaste: [String],
  createdAt: ISOString,
  updatedAt: ISOString
}
```

### Users
```
{
  id: "user#<uuid>",
  name: String,
  email: String,
  password: String (hashed),
  role: String,
  preferences: Object,
  createdAt: ISOString,
  updatedAt: ISOString
}
```

### Statistics
```
{
  id: "stats#<timestamp>",
  statistics: {
    totalWaste: Number,
    wasteByType: Object,
    percentagesByType: Object
  },
  createdAt: ISOString
}
```

### Impact Metrics
```
{
  id: "impact#<timestamp>",
  metrics: {
    carbonSaved: Number,
    waterSaved: Number,
    treesEquivalent: Number,
    timestamp: ISOString
  },
  createdAt: ISOString
}
```

## Deployment

The backend is deployed using the Serverless Framework through GitHub Actions. The deployment workflow is configured in `.github/workflows/aws-deploy.yml`.

### Deployment Steps

1. Changes are pushed to the main branch
2. GitHub Actions workflow is triggered
3. Dependencies are installed
4. Backend is packaged and deployed to AWS Lambda
5. API Gateway configuration is updated
6. DynamoDB tables are created or updated

### Environment Configuration

The backend requires the following environment variables:

- `NODE_ENV` - Environment (development, staging, production)
- `AWS_REGION` - AWS region for deployment
- `JWT_SECRET` - Secret for JWT token generation
- `CORS_ORIGIN` - Allowed origin for CORS
- `TABLE_NAME` - DynamoDB table name

## Local Development

To run the backend locally:

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and configure
3. Start the server: `node backend/server.js`

### Local DynamoDB

For local development, you can use DynamoDB Local:

1. Install Docker
2. Run: `docker run -p 8000:8000 amazon/dynamodb-local`
3. The application will automatically connect to local DynamoDB if `NODE_ENV` is not `production`

## Testing

The backend includes utilities for testing:

- Mock data generators in `tests/mock-data.js`
- Database seeding script in `tests/seed-data.js`

To seed the database with test data:

```
node backend/tests/seed-data.js
```

To clear the database:

```
node backend/tests/seed-data.js --clear
```