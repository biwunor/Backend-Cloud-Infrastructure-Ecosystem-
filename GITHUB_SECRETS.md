# GitHub Secrets Configuration

This document provides instructions for setting up the required secrets for automated deployments via GitHub Actions.

## Required Secrets by Deployment Target

### AWS Deployment

| Secret Name | Description | Format |
|-------------|-------------|--------|
| `AWS_ACCESS_KEY_ID` | AWS access key ID | `AKIAXXXXXXXXXXXXXXXX` |
| `AWS_SECRET_ACCESS_KEY` | AWS secret access key | `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `AWS_REGION` | Default AWS region for deployment | `us-west-2` |
| `API_URL` | API URL for frontend to connect to backend | `https://api.example.com` |

#### How to Create AWS Credentials

1. Log in to the [AWS Console](https://console.aws.amazon.com/)
2. Navigate to IAM > Users > Add User
3. Set a username (e.g., `github-actions-deploy`)
4. Select "Programmatic access" for Access type
5. Attach the following policies:
   - `AmazonS3FullAccess`
   - `CloudFrontFullAccess`
   - `AmazonDynamoDBFullAccess`
   - `AmazonAPIGatewayAdministrator`
   - `AWSLambda_FullAccess`
   - `IAMFullAccess`
   - `AmazonECR-FullAccess`
   - `AmazonECS-FullAccess`
   - `CloudWatchLogsFullAccess`
6. Review and create the user
7. Save the access key ID and secret access key

### Netlify Deployment

| Secret Name | Description | Format |
|-------------|-------------|--------|
| `NETLIFY_AUTH_TOKEN` | Netlify personal access token | `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `NETLIFY_SITE_ID` | Netlify site ID | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `API_URL` | API URL for frontend to connect to backend | `https://api.example.com` |

#### How to Get Netlify Credentials

1. Log in to [Netlify](https://app.netlify.com/)
2. Go to User Settings > Applications > Personal access tokens
3. Generate a new access token with a description (e.g., `GitHub Actions`)
4. For the site ID, go to Site settings > General > Site details > Site ID

### GitHub Pages Deployment

For GitHub Pages, fewer secrets are required since the deployment happens within GitHub:

| Secret Name | Description | Format |
|-------------|-------------|--------|
| `API_URL` | API URL for frontend to connect to backend | `https://api.example.com` |

## Adding Secrets to GitHub Repository

1. Navigate to your repository on GitHub
2. Go to Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Enter the secret name and value
5. Click "Add secret"

## Testing Secret Configuration

You can verify your secrets are properly configured by manually triggering a workflow:

1. Navigate to your repository on GitHub
2. Go to Actions > Select a workflow
3. Click "Run workflow"
4. Choose the branch to run the workflow on
5. Click "Run workflow"

Monitor the workflow execution for any errors related to missing or incorrect secrets.

## Security Best Practices

- Rotate your AWS access keys regularly
- Use IAM roles with least privilege principles
- Never commit secrets directly to the repository
- Consider using OIDC for AWS authentication instead of long-lived access keys
- Review and audit your secrets periodically