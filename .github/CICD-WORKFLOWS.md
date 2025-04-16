# CI/CD Workflows Documentation

This document provides comprehensive information about the CI/CD workflows available in this repository.

## Overview

The CI/CD ecosystem in this repository consists of multiple interconnected workflows that handle different aspects of the software development lifecycle:

1. **CI Pipeline** (`ci.yml`): Runs tests, linting, security checks, and builds the application
2. **GitHub Pages Deployment** (`github-pages-deploy.yml`): Deploys the application to GitHub Pages
3. **AWS Deployment** (`aws-deploy.yml`): Deploys the application to AWS (S3, CloudFront, Lambda, API Gateway)
4. **Netlify Deployment** (`netlify-deploy.yml`): Deploys the application to Netlify
5. **Security Scanning** (`security-scan.yml`): Performs security analysis of code, dependencies, and infrastructure
6. **Pipeline Manager** (`pipeline-manager.yml`): Provides pipeline visualization and management capabilities
7. **Status Badges** (`status-badges.yml`): Updates status badges for GitHub repository
8. **Environment Manager** (`environment-manager.yml`): Manages deployment environments

## Workflow Details

### CI Pipeline

**File**: `.github/workflows/ci.yml`

**Purpose**: Run automated tests, code quality checks, and build the application.

**Triggers**:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Manual trigger

**Main Jobs**:
- `lint`: Run ESLint to check code quality
- `test`: Run unit and integration tests
- `build`: Build the application
- `security-scan`: Run security checks for dependencies
- `docker-build`: Build and test Docker image

**Usage Example**:
```bash
# Manually trigger the CI pipeline
gh workflow run ci.yml
```

### GitHub Pages Deployment

**File**: `.github/workflows/github-pages-deploy.yml`

**Purpose**: Deploy the application to GitHub Pages.

**Triggers**:
- Successful completion of the CI pipeline for `main` branch
- Push to `main` branch with changes in frontend files
- Manual trigger with environment selection

**Main Jobs**:
- `prepare`: Set up deployment environment and parameters
- `build`: Build the application for the specified environment
- `deploy`: Deploy to GitHub Pages
- `notify`: Send notification about deployment status

**Usage Example**:
```bash
# Deploy to GitHub Pages with specific environment and deployment notes
gh workflow run github-pages-deploy.yml -f environment=staging -f deploy_notes="Fix navigation bug"
```

### AWS Deployment

**File**: `.github/workflows/aws-deploy.yml`

**Purpose**: Deploy the application to AWS infrastructure.

**Triggers**:
- Successful completion of the CI pipeline for `main` branch
- Push to `main` branch with changes in backend or infrastructure files
- Manual trigger with environment and deployment type selection

**Main Jobs**:
- `prepare`: Set up deployment environment and parameters
- `validate-cloudformation`: Validate CloudFormation templates
- `validate-terraform`: Validate Terraform configurations
- `validate-serverless`: Validate Serverless Framework configurations
- `build`: Build the application for deployment
- `deploy-infrastructure`: Deploy AWS infrastructure
- `deploy-frontend`: Deploy frontend to S3/CloudFront
- `deploy-backend`: Deploy backend with Serverless Framework
- `finalize`: Create deployment records and status
- `notify`: Send notification about deployment status

**Usage Example**:
```bash
# Deploy to AWS with specific environment and deployment type
gh workflow run aws-deploy.yml -f environment=dev -f deploy_type=full -f deploy_notes="Initial deployment"
```

### Security Scanning

**File**: `.github/workflows/security-scan.yml`

**Purpose**: Perform security analysis of code, dependencies, and infrastructure.

**Triggers**:
- Scheduled run (every Monday at 2 AM UTC)
- Manual trigger with scan type selection

**Main Jobs**:
- `dependency-scan`: Check for vulnerabilities in dependencies
- `infrastructure-scan`: Check for security issues in infrastructure code
- `code-scan`: Run security analysis on application code
- `scan-report`: Generate consolidated security report

**Usage Example**:
```bash
# Run a full security scan
gh workflow run security-scan.yml -f scan_type=full
```

### Pipeline Manager

**File**: `.github/workflows/pipeline-manager.yml`

**Purpose**: Provide pipeline visualization and management capabilities.

**Triggers**:
- Completion of CI, GitHub Pages, AWS, or Netlify workflows
- Manual trigger to generate deployment report

**Main Jobs**:
- `track-pipeline`: Track and visualize pipeline status
- `generate-report`: Create comprehensive pipeline report

**Usage Example**:
```bash
# Generate a pipeline report
gh workflow run pipeline-manager.yml -f generate_report=true
```

### Status Badges

**File**: `.github/workflows/status-badges.yml`

**Purpose**: Update status badges for GitHub repository.

**Triggers**:
- Completion of CI, GitHub Pages, AWS, or Netlify workflows
- Manual trigger

**Main Jobs**:
- `update-badges`: Update status badges for all workflows

**Usage Example**:
```bash
# Update status badges manually
gh workflow run status-badges.yml
```

### Environment Manager

**File**: `.github/workflows/environment-manager.yml`

**Purpose**: Manage deployment environments.

**Triggers**:
- Manual trigger with action, environment, and region selection

**Main Jobs**:
- `manage-environment`: Create, update, or delete deployment environments
- `notify`: Send notification about environment management status

**Usage Example**:
```bash
# Create a new development environment in us-west-2
gh workflow run environment-manager.yml -f action=create -f environment=dev -f aws_region=us-west-2
```

## Environment Configuration

Environment configurations are stored in the `environments/` directory. Each environment has its own `.env` file with specific configuration values.

Template: `environments/template.env`

Environment files are generated and updated by the Environment Manager workflow.

## Secret Management

The following secrets are used by the workflows:

- `AWS_ACCESS_KEY_ID`: AWS access key ID for AWS deployments
- `AWS_SECRET_ACCESS_KEY`: AWS secret access key for AWS deployments
- `AWS_ROLE_TO_ASSUME`: (Optional) AWS IAM role ARN to assume
- `NETLIFY_AUTH_TOKEN`: Netlify authentication token
- `NETLIFY_SITE_ID`: Netlify site ID
- `JWT_SECRET`: Secret for JWT token generation
- `MAP_API_KEY`: API key for map service

To add or update secrets:
1. Go to Repository Settings > Secrets and Variables > Actions
2. Click "New repository secret"
3. Enter the secret name and value
4. Click "Add secret"

## Workflow Badges

The current status of workflows can be seen with the following badges:

![CI Pipeline](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/USERNAME/REPO/main/.github/badges/CI_Pipeline.json)
![GitHub Pages](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/USERNAME/REPO/main/.github/badges/GitHub_Pages.json)
![AWS Deployment](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/USERNAME/REPO/main/.github/badges/AWS_Deployment.json)
![Netlify](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/USERNAME/REPO/main/.github/badges/Netlify.json)

## Troubleshooting

### Common Issues

1. **Workflow Failure**: Check the workflow logs for error messages. Most errors include specific information about what went wrong.

2. **AWS Deployment Failure**: Verify AWS credentials are correct and have appropriate permissions. Check CloudFormation errors in the AWS console.

3. **GitHub Pages Deployment Failure**: Ensure GitHub Pages is enabled in repository settings and the source is set to GitHub Actions.

4. **Build Failures**: Check for linting errors, test failures, or dependency issues in the CI pipeline logs.

### How to Fix

1. **Fix and Retry**:
   ```bash
   # Rerun a failed workflow
   gh workflow run WORKFLOW_FILE
   ```

2. **Manual Deployment**:
   ```bash
   # Deploy to a specific environment
   gh workflow run aws-deploy.yml -f environment=dev
   ```

3. **Rollback Deployment**:
   ```bash
   # Use the AWS CloudFormation console to rollback to a previous stack version
   # Or use the API:
   aws cloudformation rollback-stack --stack-name uw-waste-management-dev
   ```

## Best Practices

1. **Environment-Specific Deployments**: Use different environments (dev, staging, prod) for different stages of development.

2. **Regular Security Scans**: Run security scans regularly to identify and fix vulnerabilities.

3. **Update Dependencies**: Keep dependencies updated to avoid security issues and bugs.

4. **Review Workflow Logs**: Check workflow logs for warnings and errors even if the workflow succeeds.

5. **Environment Variables**: Use environment variables for configuration rather than hardcoding values.

## Further Help

If you encounter issues not covered in this documentation, please:

1. Check the GitHub Actions documentation: https://docs.github.com/en/actions
2. Review AWS CloudFormation documentation: https://docs.aws.amazon.com/cloudformation/
3. Check Serverless Framework documentation: https://www.serverless.com/framework/docs/
4. Open an issue in this repository for help