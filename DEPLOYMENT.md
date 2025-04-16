# UW Waste Management App Deployment Guide

This document provides comprehensive deployment instructions for the UW Waste Management App to various cloud platforms.

## Table of Contents

1. [Preparing for Deployment](#preparing-for-deployment)
2. [GitHub Pages Deployment](#github-pages-deployment) (Frontend Only)
3. [AWS S3 and CloudFront Deployment](#aws-s3-and-cloudfront-deployment) (Frontend)
4. [AWS Lambda Serverless Deployment](#aws-lambda-serverless-deployment) (Backend)
5. [AWS ECS Docker Deployment](#aws-ecs-docker-deployment) (Full Stack)
6. [Netlify Deployment](#netlify-deployment) (Frontend Only)
7. [Docker Deployment](#docker-deployment) (Development & Production)
8. [Environment Variables](#environment-variables)
9. [Continuous Integration/Continuous Deployment (CI/CD)](#continuous-integrationcontinuous-deployment-cicd)
10. [Infrastructure as Code](#infrastructure-as-code)
11. [Troubleshooting](#troubleshooting)

## Preparing for Deployment

Before deploying the application, ensure:

1. Your code is working correctly in local development
2. All required environment variables are set up (see [Environment Variables](#environment-variables))
3. You have run `npm run build` to create a production build
4. You have the necessary accounts and permissions for your chosen deployment platform

## GitHub Pages Deployment

### Manual Deployment

1. Make sure the `homepage` field in `package.json` is set correctly:
   ```json
   "homepage": "https://<username>.github.io/<repository-name>"
   ```

2. Run the deployment command:
   ```bash
   npm run deploy
   ```

   This will:
   - Build the project (via the `predeploy` script)
   - Push the contents of the `dist` folder to the `gh-pages` branch

3. Once deployment is complete, your site will be available at the URL specified in the `homepage` field

### Using the Deployment Utility

1. Run the deployment utility:
   ```bash
   node deploy.js
   ```

2. Select option 1 for GitHub Pages deployment
3. Follow the prompts

### Automated Deployment (GitHub Actions)

1. Push your changes to the `main` branch
2. The GitHub Actions workflow in `.github/workflows/github-pages-deploy.yml` will automatically deploy the application

## AWS S3 and CloudFront Deployment

### Prerequisites

1. AWS account with permissions to create/modify S3 buckets and CloudFront distributions
2. AWS CLI installed and configured with your credentials

### Setting Up AWS Resources

1. Create an S3 bucket for hosting:
   ```bash
   aws s3 mb s3://your-bucket-name
   ```

2. Configure the bucket for static website hosting:
   ```bash
   aws s3 website s3://your-bucket-name --index-document index.html --error-document index.html
   ```

3. Set bucket policy to allow public access (replace `your-bucket-name`):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }
   ```

4. (Optional) Create a CloudFront distribution pointing to your S3 bucket for better performance and HTTPS

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Sync the build to your S3 bucket:
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. (Optional) Create CloudFront invalidation:
   ```bash
   aws cloudfront create-invalidation --distribution-id your-distribution-id --paths "/*"
   ```

### Using the Deployment Utility

1. Run the deployment utility:
   ```bash
   node deploy.js
   ```

2. Select option 2 for AWS deployment
3. Follow the prompts

### Automated Deployment (GitHub Actions)

1. Add the required secrets to your GitHub repository (see [GITHUB_SECRETS.md](./GITHUB_SECRETS.md))
2. Push your changes to the `main` branch
3. The GitHub Actions workflow in `.github/workflows/aws-deploy.yml` will automatically deploy the application

## Netlify Deployment

### Prerequisites

1. Netlify account
2. Netlify CLI installed (optional for manual deployment)

### Manual Deployment via Netlify Dashboard

1. Build the application:
   ```bash
   npm run build
   ```

2. Drag and drop the `dist` folder onto the Netlify dashboard at https://app.netlify.com/drop

### Using Netlify CLI

1. Install Netlify CLI (if not already installed):
   ```bash
   npm install netlify-cli -g
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize a new Netlify site:
   ```bash
   netlify init
   ```

4. Deploy the site:
   ```bash
   netlify deploy --prod
   ```

### Using the Deployment Utility

1. Run the deployment utility:
   ```bash
   node deploy.js
   ```

2. Select option 3 for Netlify deployment
3. Follow the prompts

### Automated Deployment (GitHub Actions)

1. Add the required secrets to your GitHub repository (see [GITHUB_SECRETS.md](./GITHUB_SECRETS.md))
2. Push your changes to the `main` branch
3. The GitHub Actions workflow in `.github/workflows/netlify-deploy.yml` will automatically deploy the application

## AWS Lambda Serverless Deployment

This section covers deploying the backend API to AWS Lambda using the Serverless Framework.

### Prerequisites

1. AWS account with appropriate permissions
2. [Serverless Framework](https://www.serverless.com/) installed globally:
   ```bash
   npm install -g serverless
   ```
3. AWS CLI installed and configured with your credentials

### Deploying with Serverless Framework

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Deploy to AWS:
   ```bash
   serverless deploy --stage dev --region us-west-2
   ```

   This will:
   - Package your code
   - Upload to AWS S3
   - Create Lambda functions
   - Set up API Gateway
   - Configure DynamoDB tables
   - Create IAM roles

3. After deployment, you'll see outputs including your API endpoints:
   ```
   Service Information
   service: uw-waste-management
   stage: dev
   region: us-west-2
   stack: uw-waste-management-dev
   api keys:
     None
   endpoints:
     GET - https://abc123.execute-api.us-west-2.amazonaws.com/dev/api/waste
     GET - https://abc123.execute-api.us-west-2.amazonaws.com/dev/api/waste/{id}
     ...
   ```

### Removing the Deployment

To remove all resources created by the Serverless Framework:

```bash
serverless remove --stage dev --region us-west-2
```

## AWS ECS Docker Deployment

This section covers deploying the application as Docker containers to AWS ECS.

### Prerequisites

1. AWS account with appropriate permissions
2. Docker installed locally
3. AWS CLI installed and configured with your credentials
4. Amazon ECR repository created for your images

### Creating ECR Repository

```bash
aws ecr create-repository --repository-name uw-waste-management --region us-west-2
```

### Building and Pushing Docker Image

1. Navigate to the project root:
   ```bash
   cd /path/to/project
   ```

2. Build the Docker image:
   ```bash
   ./infrastructure/docker/docker-build.sh --environment prod --registry ACCOUNT_ID.dkr.ecr.us-west-2.amazonaws.com --push --ecr
   ```

   This script will:
   - Build the Docker image
   - Tag it appropriately
   - Log in to ECR
   - Push the image to ECR

### Deploying to ECS

1. Deploy using the provided script:
   ```bash
   ./infrastructure/aws/deploy-ecs.sh --environment prod --region us-west-2 --account YOUR_AWS_ACCOUNT_ID
   ```

   This script will:
   - Create an ECS cluster if it doesn't exist
   - Register a task definition
   - Create or update the ECS service
   - Wait for the deployment to stabilize

### Monitoring Your ECS Deployment

1. Check service status:
   ```bash
   aws ecs describe-services --cluster uw-waste-management-prod --services uw-waste-management-app --region us-west-2
   ```

2. View CloudWatch logs:
   ```bash
   aws logs get-log-events --log-group-name /ecs/uw-waste-management-prod --log-stream-name YOUR_LOG_STREAM --region us-west-2
   ```

## Docker Deployment

This section covers deploying the application using Docker.

### Local Development with Docker

1. Start the development environment:
   ```bash
   docker-compose up
   ```

   This will:
   - Build the application using the development target
   - Start a local DynamoDB instance
   - Start a DynamoDB admin interface at http://localhost:8001
   - Mount your code as a volume for live updates

2. Access the application:
   - Frontend: http://localhost:3000
   - API: http://localhost:3001/api
   - DynamoDB Admin: http://localhost:8001

### Production Deployment with Docker

1. Build and start the production containers:
   ```bash
   cd infrastructure/docker
   docker-compose -f docker-compose.prod.yml up -d
   ```

   This will:
   - Build the application using the production target
   - Start a production-ready container configuration
   - Start Nginx for serving the frontend and proxying API requests

2. Access the application:
   - Frontend and API: http://localhost:80 (or https://localhost:443 if SSL is configured)

### Docker Configuration Files

- `Dockerfile`: Multi-stage build for development and production
- `docker-compose.yml`: Development configuration with local services
- `infrastructure/docker/docker-compose.prod.yml`: Production configuration with Nginx
- `infrastructure/docker/nginx/nginx.conf`: Nginx configuration for production

## Environment Variables

The application uses environment variables for configuration. For deployment, you'll need to ensure these variables are set in your deployment environment.

### Required Variables

#### Frontend Environment Variables
- `REACT_APP_API_URL`: URL of the backend API
- `REACT_APP_MAP_API_KEY`: Google Maps API key for mapping disposal locations

#### Backend Environment Variables
- `NODE_ENV`: Environment mode (development, production)
- `JWT_SECRET`: Secret key for JWT token generation
- `DYNAMODB_TABLE`: DynamoDB table name
- `AWS_REGION`: AWS region for services
- `PORT`: Server port number

### Setting Environment Variables

#### GitHub Pages

For GitHub Pages, environment variables must be included during the build process, as GitHub Pages only serves static files.

Add them to your GitHub repository secrets and reference them in your workflow file.

#### AWS

Environment variables can be set during the build process in the GitHub Actions workflow.

#### Netlify

1. In the Netlify Dashboard, go to Site settings > Build & deploy > Environment
2. Add each environment variable
3. Trigger a new deployment

## Continuous Integration/Continuous Deployment (CI/CD)

The project includes GitHub Actions workflows for automated deployment:

1. `.github/workflows/github-pages-deploy.yml` - Deploys to GitHub Pages
2. `.github/workflows/aws-deploy.yml` - Deploys to AWS S3 and CloudFront
3. `.github/workflows/netlify-deploy.yml` - Deploys to Netlify

These workflows are triggered automatically when code is pushed to the `main` branch.

## Infrastructure as Code

The project follows infrastructure as code principles, with all infrastructure defined in version-controlled configuration files.

### CloudFormation

The AWS CloudFormation template (`infrastructure/aws/cloudformation.yml`) defines:

- S3 bucket for frontend hosting
- CloudFront distribution
- DynamoDB table
- Lambda execution role
- API Gateway

To deploy:

```bash
cd infrastructure/aws
./deploy-cloudformation.sh --environment dev --region us-west-2
```

### Terraform

The Terraform configuration (`infrastructure/aws/terraform/`) includes:

- `main.tf` - Main infrastructure configuration
- `variables.tf` - Input variables
- `outputs.tf` - Output values

To deploy:

```bash
cd infrastructure/aws/terraform
terraform init
terraform plan -var="environment=dev"
terraform apply -var="environment=dev"
```

### Serverless Framework

The Serverless Framework configuration (`backend/infrastructure/serverless.yml`) defines:

- Lambda functions
- API Gateway endpoints
- DynamoDB table
- IAM permissions

To deploy:

```bash
cd backend
serverless deploy --stage dev
```

### Docker Compose

Docker Compose files define the containerized infrastructure:

- `docker-compose.yml` - Development environment
- `infrastructure/docker/docker-compose.prod.yml` - Production environment

These files define services, networks, volumes, and environment variables for consistent container deployments.

### AWS ECS

ECS configuration files define container orchestration settings:

- `infrastructure/aws/ecs-task-definition.json` - Task definition
- `infrastructure/aws/ecs-service.json` - Service configuration

These define how containers should run in the ECS environment.

## Troubleshooting

### Common Issues

1. **404 Errors on Page Refresh**
   - For AWS S3, configure the error document to redirect to index.html
   - For Netlify, the included `_redirects` file should handle this
   - For GitHub Pages, add a custom 404.html file

2. **Environment Variables Not Working**
   - Ensure variables are prefixed with `VITE_` for frontend access
   - Check that the variables are correctly set in your deployment platform
   - Rebuild and redeploy after changing environment variables

3. **Build Failures**
   - Check the build logs for specific errors
   - Ensure all dependencies are correctly installed
   - Verify that your code doesn't have any syntax errors

### Getting Help

If you encounter issues not covered here, please:

1. Check the GitHub Issues for similar problems
2. Consult the documentation for your deployment platform
3. Create a new issue with detailed information about the problem