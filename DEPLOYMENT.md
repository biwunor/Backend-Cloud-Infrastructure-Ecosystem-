# Comprehensive AWS Deployment Guide

This document provides detailed instructions for deploying the UW Help App using a comprehensive AWS architecture with Amplify, ECS, RDS, and a robust networking infrastructure.

**Version:** 2.0.0  
**Last Updated:** April 16, 2025  
**Author:** Bonaventure  
**Project ID:** PROYNSMD

## Architecture Overview

The application is deployed using a modern cloud-native architecture with multiple AWS services integrated to provide a scalable, secure, and maintainable platform:

### Core Infrastructure
- **VPC & Networking**: Custom VPC with public and private subnets across multiple availability zones
- **Frontend/Backend**: Containerized Node.js application
- **Container Orchestration**: AWS ECS Fargate
- **Databases**: 
  - AWS DynamoDB for NoSQL data
  - AWS RDS PostgreSQL for relational data
- **Static Content**: AWS S3 buckets with restricted access
- **Authentication**: AWS Cognito via AWS Amplify
- **CDN**: AWS CloudFront with global edge locations
- **DNS Management**: AWS Route 53 with custom domain
- **SSL/TLS**: AWS Certificate Manager for secure HTTPS
- **Infrastructure as Code**: Terraform for consistent deployments
- **CI/CD Pipeline**: GitHub Actions for automated builds and deployments
- **Monitoring**: CloudWatch with custom dashboards and alerts
- **Secrets Management**: AWS Secrets Manager for sensitive credentials

### AWS Amplify Components
- **Web Hosting**: Scalable frontend hosting with built-in CI/CD
- **Authentication**: Cognito user pools with identity federation
- **GraphQL API**: AppSync API with schema-first development
- **Storage**: S3 buckets for user content and media
- **Functions**: Lambda functions for serverless processing

### Database Strategy
- **DynamoDB**: For high-throughput, low-latency access patterns
- **PostgreSQL RDS**: For complex queries and relational data
- **Multi-AZ**: High availability with automatic failover
- **Automated Backups**: Point-in-time recovery capability

![Architecture Diagram](architecture-diagram.png)

## Prerequisites

Before deployment, ensure you have:

1. An AWS account with appropriate permissions
2. A registered domain name (for production deployment)
3. GitHub repository with the application code
4. AWS CLI installed and configured locally
5. Terraform CLI installed locally (v1.0.0+)
6. Docker installed locally (for testing)

## Required AWS Permissions

For deployment, you'll need an IAM role with the following permissions:

- AmazonECR-FullAccess
- AmazonECS-FullAccess
- AmazonDynamoDBFullAccess
- AmazonRoute53FullAccess
- AmazonCloudFrontFullAccess
- AmazonS3FullAccess
- AmazonVPCFullAccess
- AWSCertificateManagerFullAccess
- CloudWatchFullAccess
- IAMFullAccess (or a custom policy with required IAM permissions)
- AmazonSSMFullAccess (for securely managing secrets)

## Required GitHub Secrets

Add the following secrets to your GitHub repository:

- `AWS_ROLE_TO_ASSUME`: ARN of the IAM role for GitHub Actions to assume
- `AWS_ACCOUNT_ID`: Your AWS account ID

## Deployment Environments

The deployment solution supports three environments:

1. **Development (dev)**: For ongoing development and testing
2. **Staging**: For pre-production testing and verification
3. **Production (prod)**: For live production deployment

## Deployment Methods

### Method 1: Using GitHub Actions (Recommended)

1. Push your changes to the GitHub repository
2. GitHub Actions will automatically trigger a deployment:
   - Pushing to `develop` branch deploys to the development environment
   - Pushing to `main` branch deploys to the production environment
3. Alternatively, manually trigger a workflow from the Actions tab:
   - Go to the GitHub repository → Actions → AWS Deploy
   - Click "Run workflow"
   - Select the desired environment
   - Click "Run workflow"

### Method 2: Using Terraform Directly

1. Navigate to the `terraform` directory
2. Initialize Terraform:
   ```bash
   terraform init
   ```
3. Select the appropriate workspace:
   ```bash
   terraform workspace select dev|staging|prod
   ```
   (If it doesn't exist, create it: `terraform workspace new dev|staging|prod`)
4. Plan the deployment:
   ```bash
   terraform plan -var="domain_name=yourdomain.com" -var="create_route53_zone=true"
   ```
5. Apply the changes:
   ```bash
   terraform apply -var="domain_name=yourdomain.com" -var="create_route53_zone=true"
   ```

### Method 3: Using the Deployment Script

1. Make the deployment script executable:
   ```bash
   chmod +x scripts/deploy.sh
   ```
2. Run the deployment script:
   ```bash
   ./scripts/deploy.sh --environment dev|staging|prod --action plan|apply|destroy
   ```
3. Follow the prompts and review the output

## Domain Name Configuration

### Registering a Domain with Route 53 (Optional)

1. Go to AWS Route 53 console → Registered domains → Register domain
2. Follow the steps to register a new domain
3. Once registered, deployment will automatically use this domain

### Using an Existing Domain

1. If using an existing domain registered elsewhere, you need to:
   - Set `create_route53_zone` to `true`
   - After deployment, get the NS records from the Route 53 hosted zone
   - Update your domain registrar's DNS settings with these NS records

2. If your domain is already managed by Route 53:
   - Set `create_route53_zone` to `false`
   - Make sure the variable `domain_name` matches exactly with your Route 53 hosted zone name

## SSL Certificate Validation

When deploying with a custom domain, an SSL certificate will be created and validated automatically through DNS validation. This process:

1. Creates the SSL certificate in AWS Certificate Manager
2. Adds the required validation records to Route 53
3. Waits for the certificate to be validated (this may take 5-30 minutes)

## Monitoring and Logging

The deployment includes:

- **CloudWatch Dashboard**: Access through AWS console → CloudWatch → Dashboards
- **CloudWatch Logs**: ECS logs are available at `/ecs/uw-help-app`
- **CloudWatch Alarms**: Configured for CPU and memory utilization

## Scaling Configuration

The application is configured to scale automatically based on:

- CPU utilization (scales up at 70% utilization)
- Memory utilization (scales up at 70% utilization)

You can adjust these settings in `terraform/modules/ecs/main.tf`.

## Costs Management

Resource costs can be managed through:

- Scaling down during non-peak hours
- Using CloudFront price class `PriceClass_100` (default) instead of global distribution
- Using DynamoDB on-demand capacity for development and predictable provisioned capacity for production

## Cleanup

To delete all resources:

```bash
./scripts/deploy.sh --environment dev|staging|prod --action destroy
```

**Warning**: This will destroy all resources in the specified environment, including databases and stored data.

## Troubleshooting

### Common Issues and Solutions

1. **Deployment fails with IAM permission errors**:
   - Verify IAM role has all required permissions
   - Check GitHub secrets are correctly configured

2. **Certificate validation timeout**:
   - Manually verify DNS records in Route 53
   - Check domain registrar for correct NS records if using an external domain

3. **Task definition not found**:
   - Ensure the task definition file is correctly located at `.aws/task-definition.json`
   - Verify container name in task definition matches the name in GitHub workflow

4. **Container fails to start**:
   - Check CloudWatch logs for application errors
   - Verify secrets are correctly configured in AWS Parameter Store

5. **CloudFront distribution shows error**:
   - Verify health check endpoint is correctly implemented and responding
   - Check SSL certificate is valid and correctly attached

## AWS Amplify Deployment

AWS Amplify provides a simplified way to deploy and manage the frontend application with built-in CI/CD, authentication, and backend services.

### Initial Amplify Setup

1. Install the Amplify CLI:
   ```bash
   npm install -g @aws-amplify/cli
   ```

2. Configure Amplify with your AWS account:
   ```bash
   amplify configure
   ```

3. Initialize Amplify in your project:
   ```bash
   amplify init
   ```
   - Follow the prompts to configure your project

### Adding Authentication

1. Add authentication to your Amplify project:
   ```bash
   amplify add auth
   ```
   - Configure authentication settings as needed
   - Select social providers if required (Google, Facebook, etc.)

2. Push the changes to the cloud:
   ```bash
   amplify push
   ```

### Configuring GraphQL API

1. Add the API to your Amplify project:
   ```bash
   amplify add api
   ```
   - Select GraphQL as the API type
   - Choose Amazon Cognito User Pool for authentication
   - Select additional auth types if needed

2. Edit the GraphQL schema in `amplify/backend/api/uwHelpAppApi/schema.graphql`

3. Generate the API code and push changes:
   ```bash
   amplify push
   ```

### Deploying with Amplify Console

1. Connect your repository to Amplify Console:
   - Go to AWS Amplify Console
   - Click "Connect app"
   - Select your GitHub repository
   - Follow the setup wizard

2. Configure build settings:
   - The `amplify.yml` file in the repository root defines the build process
   - Customize environment variables and build commands as needed

3. Configure branch-based deployments:
   - Main branch: Production environment
   - Develop branch: Development environment

4. Trigger a deployment:
   - Commit and push to your connected repository
   - Amplify automatically builds and deploys the application

## PostgreSQL RDS Setup

The application uses PostgreSQL RDS for relational data storage with the following configuration:

### RDS Configuration

1. **Instance Configuration**:
   - Engine: PostgreSQL 13.7
   - Instance Class: db.t4g.small (dev), db.t4g.medium (staging), db.m6g.large (prod)
   - Storage: gp3 SSD with automatic scaling
   - Multi-AZ: Enabled for staging and production environments

2. **Security Configuration**:
   - VPC: Deployed in private subnets
   - Security Group: Access restricted to application ECS tasks
   - Encryption: Storage and connections encrypted
   - Password: Generated securely and stored in AWS Secrets Manager

3. **Monitoring**:
   - Enhanced Monitoring: 60-second intervals
   - Performance Insights: Enabled for production
   - CloudWatch Alarms: CPU, memory, storage, and connection count thresholds

### Database Migration Strategy

1. **Initial Schema Setup**:
   - Bootstrap schema is created during the first deployment
   - Base tables and indexes are defined in Terraform

2. **Schema Migrations**:
   - Use migrations table to track applied migrations
   - Migrations are applied during application startup
   - Migration scripts are version-controlled in the repository

3. **Backup Strategy**:
   - Automated daily backups with 7-day retention (production)
   - Point-in-time recovery enabled
   - Manual snapshots before major changes

## VPC and Networking

The application is deployed within a custom VPC with the following architecture:

### VPC Design

1. **CIDR Block**: 10.0.0.0/16

2. **Subnets**:
   - Public Subnets: 10.0.1.0/24, 10.0.2.0/24, 10.0.3.0/24
   - Private Application Subnets: 10.0.11.0/24, 10.0.12.0/24, 10.0.13.0/24
   - Private Database Subnets: 10.0.21.0/24, 10.0.22.0/24, 10.0.23.0/24

3. **Availability Zones**:
   - Distributed across three AZs for high availability
   - us-west-2a, us-west-2b, us-west-2c (default)

4. **Internet Connectivity**:
   - Internet Gateway for public subnets
   - NAT Gateways in each public subnet for private subnet internet access

5. **Security Groups**:
   - ALB Security Group: HTTP/HTTPS from anywhere
   - ECS Security Group: Traffic from ALB only
   - RDS Security Group: Database port from ECS security group only
   - Redis Security Group (if used): Redis port from ECS security group only

### Network Flow

1. **External Traffic**:
   - User → CloudFront → Application Load Balancer (in public subnets) → ECS Services (in private subnets)

2. **Database Access**:
   - ECS Services (in private subnets) → RDS (in private database subnets)

3. **Internet Access from Private Subnets**:
   - ECS Services → NAT Gateway → Internet Gateway → Internet

## Support and Operations

For ongoing operational support with the AWS deployment:

### Monitoring and Alerts

1. Set up CloudWatch alerts for:
   - CPU and memory utilization beyond thresholds
   - Error rates exceeding normal levels
   - Database connection issues
   - ECS service health check failures

2. Configure alert notifications:
   - Email notifications via SNS
   - Slack integration for real-time alerts

### Operations Documentation

1. Keep runtime operation documentation in the `docs/operations` directory:
   - Runbooks for common issues
   - High-level troubleshooting guide
   - Database maintenance procedures

### Support Contacts

For additional support with deployment issues:

- Check the AWS service status page: https://status.aws.amazon.com/
- Review CloudWatch logs for detailed error messages
- Contact the DevOps team:
  - Email: devops@example.com
  - Slack: #uw-help-app-support
  - Emergency: +1 (555) 123-4567