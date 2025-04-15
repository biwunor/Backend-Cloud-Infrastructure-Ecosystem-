# UW Help App Deployment Guide

This document provides comprehensive deployment instructions for the UW Help App to various cloud platforms.

## Table of Contents

1. [Preparing for Deployment](#preparing-for-deployment)
2. [GitHub Pages Deployment](#github-pages-deployment)
3. [AWS S3 and CloudFront Deployment](#aws-s3-and-cloudfront-deployment)
4. [Netlify Deployment](#netlify-deployment)
5. [Environment Variables](#environment-variables)
6. [Continuous Integration/Continuous Deployment (CI/CD)](#continuous-integrationcontinuous-deployment-cicd)
7. [Troubleshooting](#troubleshooting)

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

## Environment Variables

The application uses environment variables for configuration. For deployment, you'll need to ensure these variables are set in your deployment environment.

### Required Variables

- `VITE_FIREBASE_API_KEY`: Your Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID`: Your Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID`: Your Firebase app ID

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