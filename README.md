# UW Waste Management App - Deployment Configurations

This repository contains comprehensive deployment configurations for the UW Waste Management App to various cloud platforms.

## Deployment Options

### 1. GitHub Pages (Static Frontend)
- **Configuration**: `.github/workflows/github-pages-deploy.yml`
- **Automated Deployment**: Triggered on push to the main branch
- **Manual Configuration**: See `infrastructure/github-pages/` directory
- **Required Secrets**: See `GITHUB_SECRETS.md` for setup instructions

### 2. AWS (Full Stack)
- **CloudFormation**: `infrastructure/aws/cloudformation.yml`
- **Terraform**: `infrastructure/aws/terraform/` directory
- **ECS/Fargate**: Container deployment with `infrastructure/aws/ecs-*.json` files
- **Lambda**: Serverless deployment with `backend/infrastructure/serverless.yml`
- **Automated Deployment**: `.github/workflows/aws-deploy.yml` 
- **Required Secrets**: See `GITHUB_SECRETS.md` for setup instructions

### 3. Netlify (Static Frontend)
- **Configuration**: `netlify.toml` and `.github/workflows/netlify-deploy.yml`
- **Automated Deployment**: Triggered on push to the main branch
- **Required Secrets**: See `GITHUB_SECRETS.md` for setup instructions

### 4. Docker (Development & Production)
- **Dockerfile**: Multi-stage build for development and production
- **Docker Compose**: 
  - Development: `docker-compose.yml`
  - Production: `infrastructure/docker/docker-compose.prod.yml`
- **Deployment Scripts**: `infrastructure/docker/docker-build.sh`

## Local Development with Docker

Start the development environment with all required services:

```bash
docker-compose up
```

This will start:
- The application in development mode
- Local DynamoDB instance
- DynamoDB Admin UI (accessible at http://localhost:8001)

## Cloud Deployment Instructions

### AWS CloudFormation Deployment

```bash
cd infrastructure/aws
./deploy-cloudformation.sh --environment dev --region us-west-2
```

### AWS Terraform Deployment

```bash
cd infrastructure/aws/terraform
./deploy.sh --environment dev --region us-west-2
```

### AWS ECS Deployment

```bash
cd infrastructure/aws
./deploy-ecs.sh --environment dev --region us-west-2 --account YOUR_AWS_ACCOUNT_ID
```

### AWS Serverless Deployment

Requires the [Serverless Framework](https://www.serverless.com/):

```bash
cd backend
serverless deploy --stage dev --region us-west-2
```

## Deployment Utility

The included `deploy.js` script provides an interactive CLI utility for manual deployments:

```bash
node deploy.js
```

Select from the available deployment options in the interactive menu.

## Documentation

- `DEPLOYMENT.md` - Comprehensive deployment guide
- `DEPLOY-HELP.md` - Quick reference for deployment troubleshooting
- `GITHUB_SECRETS.md` - Instructions for setting up required secrets

## Infrastructure as Code

All infrastructure is defined as code, supporting:

- CloudFormation templates
- Terraform configuration
- Serverless Framework
- Docker configurations
- GitHub Actions workflows

This ensures consistent, reproducible deployments across all environments.

## Security Best Practices

- All API keys and secrets are stored securely in environment variables or secret managers
- Production deployments use HTTPS with proper certificates
- IAM roles follow the principle of least privilege
- Database access is restricted to application services only