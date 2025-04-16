# UW Waste Management App - Deployment Quick Help

This document provides quick troubleshooting tips for common deployment issues.

## Quick Reference

| Platform | Command | Notes |
|----------|---------|-------|
| AWS S3/CloudFront | `cd infrastructure/aws && ./deploy-cloudformation.sh --environment dev` | Frontend deployment |
| AWS Lambda | `cd backend && serverless deploy --stage dev` | Backend API deployment |
| AWS ECS | `cd infrastructure/aws && ./deploy-ecs.sh --environment dev --account YOUR_ACCOUNT_ID` | Containerized deployment |
| GitHub Pages | Auto-deployed via GitHub Actions | Frontend only |
| Netlify | Auto-deployed via GitHub Actions | Frontend only |
| Docker Local | `docker-compose up` | Development environment |
| Docker Production | `cd infrastructure/docker && docker-compose -f docker-compose.prod.yml up -d` | Production environment |

## Common Issues

### 1. Authentication Issues

**AWS**
```
Error: An error occurred (AccessDenied) when calling the CreateStack operation: User: arn:aws:iam::123456789012:user/username is not authorized to perform: cloudformation:CreateStack
```

**Solution**: Check your AWS credentials and IAM permissions. Ensure the user has sufficient permissions for the services being deployed.

### 2. CloudFormation/Terraform Deployment Failures

**Error**:
```
Error: Error creating CloudFormation stack: AlreadyExistsException: Stack [stack-name] already exists
```

**Solution**: Use update-stack instead of create-stack, or delete the existing stack first.

```bash
aws cloudformation delete-stack --stack-name stack-name
```

### 3. Docker Issues

**Error**:
```
Error response from daemon: Conflict. The container name "/container-name" is already in use.
```

**Solution**: Remove the existing container or use a different name.

```bash
docker rm -f container-name
```

### 4. Serverless Deployment Issues

**Error**:
```
Error: The security token included in the request is invalid
```

**Solution**: Check your AWS credentials and ensure they're properly configured.

```bash
aws configure
```

### 5. Environment Variables Not Working

**Problem**: Application can't access environment variables.

**Solution**: 
- For React apps, ensure variables are prefixed with `REACT_APP_`
- For serverless, check that variables are properly defined in serverless.yml
- For Docker, verify they're set in docker-compose.yml

### 6. Network/CORS Issues

**Problem**: Frontend can't communicate with backend API due to CORS.

**Solution**: 
- Ensure API Gateway has proper CORS configuration
- For local development, check that backend allows localhost origins
- For production, verify that API domain is allowed in CORS config

## Quick Commands

### Check Deployment Status

```bash
# AWS CloudFormation stack status
aws cloudformation describe-stacks --stack-name stack-name

# Serverless info
serverless info --stage dev

# Docker containers
docker ps

# Docker logs
docker logs container-name
```

### Rollback or Delete Deployments

```bash
# Delete CloudFormation stack
aws cloudformation delete-stack --stack-name stack-name

# Remove serverless deployment
serverless remove --stage dev

# Stop Docker containers
docker-compose down
```

## Getting More Help

For detailed deployment instructions, refer to the full [DEPLOYMENT.md](./DEPLOYMENT.md) document.

If your issue isn't covered here, check:
1. AWS or relevant platform documentation
2. Project GitHub issues
3. Serverless Framework or Docker documentation