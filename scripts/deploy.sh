#!/bin/bash

set -e

# Parse command line arguments
ENVIRONMENT="dev"
ACTION="plan"

print_usage() {
  echo "Usage: $0 [OPTIONS]"
  echo "Options:"
  echo "  -e, --environment [dev|staging|prod]    Deployment environment (default: dev)"
  echo "  -a, --action [plan|apply|destroy]       Terraform action to perform (default: plan)"
  echo "  -h, --help                              Display this help message"
}

while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    -e|--environment)
      ENVIRONMENT="$2"
      shift 2
      ;;
    -a|--action)
      ACTION="$2"
      shift 2
      ;;
    -h|--help)
      print_usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      print_usage
      exit 1
      ;;
  esac
done

# Validate inputs
if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|prod)$ ]]; then
  echo "Error: Environment must be 'dev', 'staging', or 'prod'"
  exit 1
fi

if [[ ! "$ACTION" =~ ^(plan|apply|destroy)$ ]]; then
  echo "Error: Action must be 'plan', 'apply', or 'destroy'"
  exit 1
fi

# Set AWS region based on environment
case $ENVIRONMENT in
  dev)
    AWS_REGION=${AWS_REGION:-"us-west-2"}
    ;;
  staging)
    AWS_REGION=${AWS_REGION:-"us-west-2"}
    ;;
  prod)
    AWS_REGION=${AWS_REGION:-"us-west-2"}
    ;;
esac

echo "=========================================================="
echo "  UW Help App - Deployment Script"
echo "=========================================================="
echo "  Environment: $ENVIRONMENT"
echo "  AWS Region: $AWS_REGION"
echo "  Action: $ACTION"
echo "=========================================================="

# Check for required tools
for cmd in aws terraform docker; do
  if ! command -v $cmd &> /dev/null; then
    echo "Error: $cmd command not found"
    echo "Please install $cmd before proceeding"
    exit 1
  fi
done

# Check AWS credentials
echo "Checking AWS credentials..."
if ! aws sts get-caller-identity &> /dev/null; then
  echo "Error: AWS credentials are not configured or are invalid"
  echo "Please run 'aws configure' or set the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables"
  exit 1
fi

# Create S3 bucket for Terraform state if it doesn't exist
BUCKET_NAME="uw-help-app-terraform-state"
if ! aws s3api head-bucket --bucket $BUCKET_NAME 2>/dev/null; then
  echo "Creating S3 bucket for Terraform state..."
  aws s3api create-bucket \
    --bucket $BUCKET_NAME \
    --region $AWS_REGION \
    --create-bucket-configuration LocationConstraint=$AWS_REGION
  
  aws s3api put-bucket-versioning \
    --bucket $BUCKET_NAME \
    --versioning-configuration Status=Enabled
  
  aws s3api put-bucket-encryption \
    --bucket $BUCKET_NAME \
    --server-side-encryption-configuration '{"Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"}}]}'
fi

# Create DynamoDB table for Terraform locks if it doesn't exist
DYNAMO_TABLE="uw-help-app-terraform-locks"
if ! aws dynamodb describe-table --table-name $DYNAMO_TABLE 2>/dev/null; then
  echo "Creating DynamoDB table for Terraform locks..."
  aws dynamodb create-table \
    --table-name $DYNAMO_TABLE \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region $AWS_REGION
fi

# Initialize Terraform
echo "Initializing Terraform..."
cd terraform
terraform init

# Select Terraform workspace
if ! terraform workspace select $ENVIRONMENT 2>/dev/null; then
  echo "Creating Terraform workspace: $ENVIRONMENT"
  terraform workspace new $ENVIRONMENT
else
  echo "Using Terraform workspace: $ENVIRONMENT"
fi

# Execute Terraform command
case $ACTION in
  plan)
    echo "Planning Terraform changes..."
    terraform plan -var="aws_region=$AWS_REGION"
    ;;
  apply)
    echo "Applying Terraform changes..."
    terraform apply -auto-approve -var="aws_region=$AWS_REGION"
    ;;
  destroy)
    echo "CAUTION: You are about to destroy all infrastructure in the $ENVIRONMENT environment!"
    read -p "Are you sure you want to continue? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      echo "Destroying Terraform infrastructure..."
      terraform destroy -auto-approve -var="aws_region=$AWS_REGION"
    else
      echo "Destroy operation cancelled"
      exit 0
    fi
    ;;
esac

# If we're applying changes in the production environment, update the parameter store with secrets
if [[ "$ACTION" == "apply" && "$ENVIRONMENT" == "prod" ]]; then
  echo "Updating SSM parameters for production..."
  
  # Check if parameters exist and update them
  if ! aws ssm get-parameter --name "/uw-help-app/jwt-secret" --region $AWS_REGION &>/dev/null; then
    echo "Creating JWT secret in SSM Parameter Store..."
    JWT_SECRET=$(openssl rand -base64 32)
    aws ssm put-parameter \
      --name "/uw-help-app/jwt-secret" \
      --value "$JWT_SECRET" \
      --type "SecureString" \
      --region $AWS_REGION
  fi
  
  # Note: In a real production environment, you would prompt for actual connection string
  # or retrieve it from a secure location
  if ! aws ssm get-parameter --name "/uw-help-app/db-connection-string" --region $AWS_REGION &>/dev/null; then
    echo "Creating database connection string in SSM Parameter Store..."
    # This is just a placeholder - in real scenario, you would use actual connection string
    DB_CONNECTION="YOUR_ACTUAL_DB_CONNECTION_STRING"
    aws ssm put-parameter \
      --name "/uw-help-app/db-connection-string" \
      --value "$DB_CONNECTION" \
      --type "SecureString" \
      --region $AWS_REGION
  fi
fi

echo "=========================================================="
echo "  Deployment completed successfully!"
echo "=========================================================="
if [[ "$ACTION" == "apply" ]]; then
  echo "  To access the application:"
  terraform output -json | jq -r '.alb_dns_name.value // "Not available"'
fi
echo "=========================================================="