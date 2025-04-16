# Deployment Guide

This document provides instructions for deploying the UW Help App to AWS using the advanced build, deployment, and hosting solution with custom domain name integration.

## Architecture Overview

The application is deployed using a modern cloud-native architecture:

- **Frontend/Backend**: Containerized Node.js application
- **Container Orchestration**: AWS ECS Fargate
- **Database**: AWS DynamoDB
- **CDN**: AWS CloudFront
- **DNS Management**: AWS Route 53
- **SSL Certificates**: AWS Certificate Manager
- **Infrastructure as Code**: Terraform
- **CI/CD Pipeline**: GitHub Actions

![Architecture Diagram](https://excalidraw.com/--placeholder--for-architecture-diagram)

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

## Support

For additional support with deployment issues:

- Check the AWS service status page
- Review CloudWatch logs for detailed error messages
- Contact the DevOps team at [devops@example.com](mailto:devops@example.com)