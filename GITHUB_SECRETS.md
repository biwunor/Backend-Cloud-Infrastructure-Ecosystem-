# Setting Up GitHub Secrets for CI/CD

This guide explains how to set up the necessary secrets in your GitHub repository for the CI/CD workflows.

## What are GitHub Secrets?

GitHub Secrets are encrypted environment variables that you can create for a repository. These secrets are available to GitHub Actions workflows and help you keep sensitive data like API tokens, access keys, and credentials secure.

## Accessing GitHub Secrets Settings

1. Navigate to your GitHub repository
2. Click on the "Settings" tab
3. In the left sidebar, click on "Secrets and variables" then "Actions"
4. Click on "New repository secret" to add a new secret

## Required Secrets for Different Deployment Options

Depending on your chosen deployment method, you'll need to set up different secrets:

### For GitHub Pages Deployment

GitHub Pages deployment doesn't require any special secrets as it uses the GITHUB_TOKEN that's automatically available to GitHub Actions.

### For AWS Deployment

For AWS S3 and CloudFront deployment, add these secrets:

| Secret Name | Description |
|-------------|-------------|
| `AWS_ACCESS_KEY_ID` | Your AWS access key ID |
| `AWS_SECRET_ACCESS_KEY` | Your AWS secret access key |
| `AWS_S3_BUCKET` | The name of your S3 bucket |
| `CLOUDFRONT_DISTRIBUTION_ID` | (Optional) Your CloudFront distribution ID for cache invalidation |

#### How to Get AWS Credentials

1. Log in to your AWS Management Console
2. Navigate to IAM (Identity and Access Management)
3. Create a new user or select an existing one
4. Create a new access key or use an existing one
5. Make sure the user has appropriate permissions for S3 and CloudFront
   - `AmazonS3FullAccess` for S3 operations
   - `CloudFrontFullAccess` for CloudFront operations

### For Netlify Deployment

For Netlify deployment, add these secrets:

| Secret Name | Description |
|-------------|-------------|
| `NETLIFY_AUTH_TOKEN` | Your Netlify personal access token |
| `NETLIFY_SITE_ID` | The site ID for your Netlify site |

#### How to Get Netlify Credentials

1. **For NETLIFY_AUTH_TOKEN**:
   - Log in to your Netlify account
   - Go to User Settings > Applications
   - Under "Personal access tokens", click "New access token"
   - Give it a description and click "Generate token"
   - Copy the token immediately (it won't be shown again)

2. **For NETLIFY_SITE_ID**:
   - Go to your Netlify site
   - Go to Site settings > General > Site details
   - The Site ID is listed in the Site information section

## Firebase Configuration Secrets (If Applicable)

If your application uses Firebase, you might want to add Firebase configuration as secrets:

| Secret Name | Description |
|-------------|-------------|
| `FIREBASE_API_KEY` | Your Firebase API key |
| `FIREBASE_AUTH_DOMAIN` | Your Firebase auth domain |
| `FIREBASE_PROJECT_ID` | Your Firebase project ID |
| `FIREBASE_STORAGE_BUCKET` | Your Firebase storage bucket |
| `FIREBASE_MESSAGING_SENDER_ID` | Your Firebase messaging sender ID |
| `FIREBASE_APP_ID` | Your Firebase app ID |

These can be found in your Firebase project settings.

## Using Secrets in GitHub Actions

These secrets are automatically available in your GitHub Actions workflows using the syntax:

```yaml
${{ secrets.SECRET_NAME }}
```

For example, in the AWS deployment workflow, the AWS access key is referenced as:

```yaml
env:
  AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
```

## Security Best Practices

- Never commit sensitive credentials directly to your repository
- Regularly rotate your access keys and tokens
- Use the principle of least privilege when assigning permissions to access keys
- Audit your secrets periodically and remove any that are no longer needed