# UW Waste Management Backend

This is the backend service for the University of Washington Waste Management application, providing API endpoints and data processing functionality.

## Quick Start

### Prerequisites

- Node.js 18 or higher
- AWS CLI (for deployment to AWS)
- Serverless Framework (`npm install -g serverless`)

### Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   ```
   cp .env.example .env
   ```

3. Start the local server:
   ```
   node server.js
   ```

4. The API will be available at http://localhost:4000

### Running with DynamoDB Local

For local development with a local DynamoDB instance:

1. Start DynamoDB Local using Docker:
   ```
   docker run -p 8000:8000 amazon/dynamodb-local
   ```

2. The application will automatically connect to the local DynamoDB instance if `NODE_ENV` is set to `development`.

### Seeding Test Data

To populate the database with test data:

```
node tests/seed-data.js
```

## Deployment

### Deploy to AWS

Using Serverless Framework:

```
serverless deploy --stage dev
```

For production:

```
serverless deploy --stage prod
```

### Continuous Deployment

The application is configured for continuous deployment using GitHub Actions. When changes are pushed to the main branch, the application is automatically deployed to AWS.

See the workflow configuration in `.github/workflows/aws-deploy.yml`.

## API Documentation

For detailed API documentation, see the [Backend Documentation](./BACKEND.md).

### Available Endpoints

- Authentication: `/api/auth/*`
- Waste Management: `/api/waste/*`
- Locations: `/api/locations/*`
- Users: `/api/users/*`
- Health Check: `/api/health`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or feedback, please contact the UW Waste Management Team.