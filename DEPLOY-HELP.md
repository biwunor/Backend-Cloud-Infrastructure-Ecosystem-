# UW Help App Deployment Guide

This document provides a guide for using the deployment utilities provided with this project.

## Deployment Options

The UW Help App supports deployment to the following platforms:

1. GitHub Pages
2. AWS S3 + CloudFront
3. Netlify

## Using the Deployment Utility

We've included a handy deployment utility script to simplify the process of deploying to different platforms.

### Running the Utility

To run the deployment utility, execute:

```bash
node deploy.js
```

This will provide an interactive menu where you can select your desired deployment target.

### GitHub Pages Deployment

For GitHub Pages deployment:

1. Run `node deploy.js`
2. Select option 1 for GitHub Pages
3. If prompted, enter your GitHub Pages URL (e.g., https://username.github.io/repo-name/)
4. The script will build and deploy the application

You can also deploy directly using:

```bash
npm run predeploy
npm run deploy
```

### AWS S3 + CloudFront Deployment

For AWS deployment:

1. First, ensure the AWS CLI is installed and configured with appropriate credentials
2. Run `node deploy.js`
3. Select option 2 for AWS S3 + CloudFront
4. Enter your S3 bucket name when prompted
5. Optionally, enter your CloudFront distribution ID for cache invalidation

Manual AWS deployment can be done with:

```bash
npm run build
aws s3 sync dist/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id your-distribution-id --paths "/*"
```

### Netlify Deployment

For Netlify deployment:

1. Ensure Netlify CLI is installed (`npm install netlify-cli -g`)
2. Run `node deploy.js`
3. Select option 3 for Netlify
4. If not logged in, the script will prompt you to log in to Netlify
5. Choose whether to create a new site or deploy to an existing one

Manual Netlify deployment can be done with:

```bash
npm run build
netlify deploy --dir=dist --prod
```

## Automated CI/CD Deployments

This project is also configured for automated CI/CD deployments using GitHub Actions:

- `.github/workflows/github-pages-deploy.yml` handles GitHub Pages deployments
- `.github/workflows/aws-deploy.yml` handles AWS deployments
- `.github/workflows/netlify-deploy.yml` handles Netlify deployments

These workflows are triggered automatically when code is pushed to the main branch.

## Required Secrets for CI/CD

For the CI/CD workflows to function properly, you'll need to add specific secrets to your GitHub repository:

### For AWS Deployment
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_S3_BUCKET`
- `CLOUDFRONT_DISTRIBUTION_ID`

### For Netlify Deployment
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`

Refer to the [GITHUB_SECRETS.md](./GITHUB_SECRETS.md) file for detailed instructions on how to add these secrets.

## Testing the Build Locally

Before deploying, you can test the production build locally:

1. Build the project:
   ```bash
   npm run build
   ```

2. Serve the production build:
   ```bash
   node serve.js
   ```

3. Open your browser and navigate to `http://localhost:3000`