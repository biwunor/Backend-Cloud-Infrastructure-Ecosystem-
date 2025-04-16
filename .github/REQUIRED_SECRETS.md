# Required GitHub Secrets

This document lists the secrets required for the CI/CD workflows in this repository.

## Overview

GitHub Actions workflows in this repository use GitHub Secrets to securely access external services and APIs. The following secrets should be configured for the workflows to function properly.

## How to Add Secrets

1. Go to your repository on GitHub
2. Click on **Settings**
3. In the left sidebar, click on **Secrets and variables** > **Actions**
4. Click on **New repository secret**
5. Enter the name and value of the secret
6. Click **Add secret**

## Required Secrets

### AWS Deployment

| Secret Name | Description | Required For |
|-------------|-------------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS IAM user access key ID | AWS deployment workflows |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM user secret access key | AWS deployment workflows |
| `AWS_ROLE_TO_ASSUME` | (Optional) ARN of AWS IAM role to assume | AWS deployment with role assumption |

### Netlify Deployment

| Secret Name | Description | Required For |
|-------------|-------------|-------------|
| `NETLIFY_AUTH_TOKEN` | Netlify personal access token | Netlify deployment workflow |
| `NETLIFY_SITE_ID` | Netlify site ID for deployment | Netlify deployment workflow |

### API Keys

| Secret Name | Description | Required For |
|-------------|-------------|-------------|
| `MAP_API_KEY` | API key for mapping service | Frontend map functionality |
| `JWT_SECRET` | Secret for JWT token generation | Backend authentication |

### Environment-Specific Variables

| Secret Name | Description | Required For |
|-------------|-------------|-------------|
| `API_URL` | Base URL for backend API | Frontend deployments |

## Environment Secrets

Each deployment environment (dev, staging, prod) can have its own set of secrets. These are configured in GitHub Environment settings.

### How to Configure Environment Secrets

1. Go to your repository on GitHub
2. Click on **Settings**
3. In the left sidebar, click on **Environments**
4. Click on an existing environment or **New environment**
5. Add environment secrets as needed

### Environment-Specific Secrets

| Secret Name | Description | Environment |
|-------------|-------------|------------|
| `JWT_SECRET` | Environment-specific JWT secret | All environments |
| `DATABASE_URL` | Database connection string | All environments |
| `LOGGING_LEVEL` | Level of logging detail | All environments |

## Secret Rotation

For security best practices, rotate the following secrets regularly:

- `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`: Every 90 days
- `NETLIFY_AUTH_TOKEN`: Every 90 days
- `JWT_SECRET`: Every 30 days for production

## Troubleshooting

If a workflow fails with an error related to secrets, check the following:

1. Ensure all required secrets are properly configured
2. Verify the secret names match exactly (they are case-sensitive)
3. For environment-specific workflows, make sure the secrets are configured for the correct environment
4. Check that the AWS IAM user has the necessary permissions

## Adding New Secrets

When adding new secrets required by workflows:

1. Update this document with the new secret details
2. Update the relevant workflow files to use the new secrets
3. Update the team about the new requirement