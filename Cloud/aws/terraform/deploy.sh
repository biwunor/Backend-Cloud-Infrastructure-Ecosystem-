#!/bin/bash

# Terraform Deployment Script for UW Waste Management App

set -e

# Default values
ENVIRONMENT="dev"
REGION="us-west-2"
DOMAIN_NAME=""
CERTIFICATE_ARN=""
WORKSPACE=""

# Display help
function show_help {
  echo "Usage: $0 [options]"
  echo "Options:"
  echo "  -e, --environment    Environment: dev, staging, prod (default: dev)"
  echo "  -r, --region         AWS region (default: us-west-2)"
  echo "  -d, --domain         Domain name (optional)"
  echo "  -c, --certificate    ACM Certificate ARN (optional)"
  echo "  -w, --workspace      Terraform workspace (default: environment value)"
  echo "  -h, --help           Show this help message"
  exit 1
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
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
    -w|--workspace)
      WORKSPACE="$2"
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

# Set workspace to environment if not specified
if [[ -z "$WORKSPACE" ]]; then
  WORKSPACE="$ENVIRONMENT"
fi

echo "Deploying Terraform configuration"
echo "Environment: $ENVIRONMENT"
echo "Region: $REGION"
echo "Workspace: $WORKSPACE"
if [ -n "$DOMAIN_NAME" ]; then
  echo "Domain: $DOMAIN_NAME"
fi

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
  echo "Error: Terraform is not installed. Please install it first."
  exit 1
fi

# Initialize Terraform
echo "Initializing Terraform..."
terraform init

# Select or create workspace
echo "Selecting workspace: $WORKSPACE"
terraform workspace select "$WORKSPACE" || terraform workspace new "$WORKSPACE"

# Build variable arguments
TF_VARS="-var=environment=$ENVIRONMENT -var=aws_region=$REGION"

if [ -n "$DOMAIN_NAME" ]; then
  TF_VARS="$TF_VARS -var=domain_name=$DOMAIN_NAME"
fi

if [ -n "$CERTIFICATE_ARN" ]; then
  TF_VARS="$TF_VARS -var=certificate_arn=$CERTIFICATE_ARN"
fi

# Plan Terraform changes
echo "Planning Terraform changes..."
terraform plan $TF_VARS

# Prompt for confirmation
read -p "Do you want to apply these changes? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Deployment aborted."
  exit 1
fi

# Apply Terraform changes
echo "Applying Terraform changes..."
terraform apply $TF_VARS -auto-approve

if [ $? -eq 0 ]; then
  echo "Terraform deployment successful!"
  
  # Output Terraform outputs
  echo "Deployment outputs:"
  terraform output
else
  echo "Terraform deployment failed!"
  exit 1
fi