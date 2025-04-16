#!/bin/bash

# CloudFormation Deployment Script for UW Waste Management App

set -e

# Default values
STACK_NAME="uw-waste-management"
ENVIRONMENT="dev"
REGION="us-west-2"
DOMAIN_NAME=""
CERTIFICATE_ARN=""

# Display help
function show_help {
  echo "Usage: $0 [options]"
  echo "Options:"
  echo "  -s, --stack-name     CloudFormation stack name (default: uw-waste-management)"
  echo "  -e, --environment    Environment: dev, staging, prod (default: dev)"
  echo "  -r, --region         AWS region (default: us-west-2)"
  echo "  -d, --domain         Domain name (optional)"
  echo "  -c, --certificate    ACM Certificate ARN (optional)"
  echo "  -h, --help           Show this help message"
  exit 1
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    -s|--stack-name)
      STACK_NAME="$2"
      shift 2
      ;;
    -e|--environment)
      ENVIRONMENT="$2"
      shift 2
      ;;
    -r|--region)
      REGION="$2"
      shift 2
      ;;
    -d|--domain)
      DOMAIN_NAME="$2"
      shift 2
      ;;
    -c|--certificate)
      CERTIFICATE_ARN="$2"
      shift 2
      ;;
    -h|--help)
      show_help
      ;;
    *)
      echo "Unknown option: $1"
      show_help
      ;;
  esac
done

# Validate environment
if [[ "$ENVIRONMENT" != "dev" && "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "prod" ]]; then
  echo "Error: Environment must be one of: dev, staging, prod"
  exit 1
fi

# Full stack name with environment
FULL_STACK_NAME="${STACK_NAME}-${ENVIRONMENT}"

# Template file path
TEMPLATE_FILE="./cloudformation.yml"

echo "Deploying CloudFormation stack: $FULL_STACK_NAME"
echo "Environment: $ENVIRONMENT"
echo "Region: $REGION"
if [ -n "$DOMAIN_NAME" ]; then
  echo "Domain: $DOMAIN_NAME"
fi

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
  echo "Error: AWS CLI is not installed. Please install it first."
  exit 1
fi

# Check if template file exists
if [ ! -f "$TEMPLATE_FILE" ]; then
  echo "Error: Template file not found: $TEMPLATE_FILE"
  exit 1
fi

# Check if stack exists
if aws cloudformation describe-stacks --stack-name "$FULL_STACK_NAME" --region "$REGION" &> /dev/null; then
  ACTION="update-stack"
  echo "Stack exists, performing update..."
else
  ACTION="create-stack"
  echo "Stack does not exist, creating new stack..."
fi

# Build parameter string
PARAMETERS="ParameterKey=Environment,ParameterValue=$ENVIRONMENT"

if [ -n "$DOMAIN_NAME" ]; then
  PARAMETERS="$PARAMETERS ParameterKey=DomainName,ParameterValue=$DOMAIN_NAME"
fi

if [ -n "$CERTIFICATE_ARN" ]; then
  PARAMETERS="$PARAMETERS ParameterKey=CertificateARN,ParameterValue=$CERTIFICATE_ARN"
fi

# Deploy the stack
echo "Deploying CloudFormation stack..."
aws cloudformation $ACTION \
  --stack-name "$FULL_STACK_NAME" \
  --template-body "file://$TEMPLATE_FILE" \
  --parameters $PARAMETERS \
  --capabilities CAPABILITY_IAM \
  --region "$REGION" \
  --tags Key=Project,Value=UW-Waste-Management Key=Environment,Value=$ENVIRONMENT

# Wait for stack operation to complete
echo "Waiting for stack operation to complete..."
aws cloudformation wait stack-$ACTION-complete --stack-name "$FULL_STACK_NAME" --region "$REGION"

if [ $? -eq 0 ]; then
  echo "Stack deployment successful!"
  
  # Output stack information
  echo "Stack outputs:"
  aws cloudformation describe-stacks --stack-name "$FULL_STACK_NAME" --region "$REGION" --query "Stacks[0].Outputs" --output table
else
  echo "Stack deployment failed!"
  exit 1
fi