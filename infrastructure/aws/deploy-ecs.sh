#!/bin/bash

# ECS Deployment Script for UW Waste Management App

set -e

# Default values
ENVIRONMENT="dev"
REGION="us-west-2"
ACCOUNT_ID=""
CLUSTER_NAME=""
TASK_DEFINITION_FILE="./ecs-task-definition.json"
SERVICE_FILE="./ecs-service.json"

# Display help
function show_help {
  echo "Usage: $0 [options]"
  echo "Options:"
  echo "  -e, --environment    Environment: dev, staging, prod (default: dev)"
  echo "  -r, --region         AWS region (default: us-west-2)"
  echo "  -a, --account        AWS account ID (required)"
  echo "  -c, --cluster        ECS cluster name (defaults to uw-waste-management-{ENVIRONMENT})"
  echo "  -t, --task-file      Path to task definition JSON file (default: ./ecs-task-definition.json)"
  echo "  -s, --service-file   Path to service definition JSON file (default: ./ecs-service.json)"
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
    -a|--account)
      ACCOUNT_ID="$2"
      shift 2
      ;;
    -c|--cluster)
      CLUSTER_NAME="$2"
      shift 2
      ;;
    -t|--task-file)
      TASK_DEFINITION_FILE="$2"
      shift 2
      ;;
    -s|--service-file)
      SERVICE_FILE="$2"
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

# Validate AWS account ID
if [ -z "$ACCOUNT_ID" ]; then
  echo "Error: AWS account ID is required. Use -a or --account option."
  exit 1
fi

# Set cluster name if not provided
if [ -z "$CLUSTER_NAME" ]; then
  CLUSTER_NAME="uw-waste-management-${ENVIRONMENT}"
fi

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
  echo "Error: AWS CLI is not installed. Please install it first."
  exit 1
fi

# Check if jq is installed
if ! command -v jq &> /dev/null; then
  echo "Error: jq is not installed. Please install it first."
  exit 1
fi

# Check if template files exist
if [ ! -f "$TASK_DEFINITION_FILE" ]; then
  echo "Error: Task definition file not found: $TASK_DEFINITION_FILE"
  exit 1
fi

if [ ! -f "$SERVICE_FILE" ]; then
  echo "Error: Service definition file not found: $SERVICE_FILE"
  exit 1
fi

echo "Deploying to ECS"
echo "Environment: $ENVIRONMENT"
echo "Region: $REGION"
echo "Cluster: $CLUSTER_NAME"

# Create ECS cluster if it doesn't exist
CLUSTER_EXISTS=$(aws ecs describe-clusters --clusters "$CLUSTER_NAME" --region "$REGION" --query "clusters[0].clusterName" --output text 2>/dev/null || echo "")
if [ -z "$CLUSTER_EXISTS" ]; then
  echo "Creating ECS cluster: $CLUSTER_NAME"
  aws ecs create-cluster \
    --cluster-name "$CLUSTER_NAME" \
    --capacity-providers FARGATE FARGATE_SPOT \
    --default-capacity-provider-strategy "capacityProvider=FARGATE,weight=1" \
    --region "$REGION" \
    --tags key=Project,value=UW-Waste-Management key=Environment,value="$ENVIRONMENT"
else
  echo "ECS cluster already exists: $CLUSTER_NAME"
fi

# Prepare task definition
echo "Preparing task definition..."
TASK_DEF_JSON=$(cat "$TASK_DEFINITION_FILE" | sed "s/ACCOUNT_ID/$ACCOUNT_ID/g" | sed "s/REGION/$REGION/g" | sed "s/ENVIRONMENT/$ENVIRONMENT/g")

# Register task definition
echo "Registering task definition..."
TASK_DEF_ARN=$(aws ecs register-task-definition \
  --region "$REGION" \
  --cli-input-json "$TASK_DEF_JSON" \
  --query "taskDefinition.taskDefinitionArn" \
  --output text)

echo "Task definition registered: $TASK_DEF_ARN"
TASK_REVISION=$(echo "$TASK_DEF_ARN" | awk -F ":" '{print $NF}')

# Check if service exists
SERVICE_EXISTS=$(aws ecs describe-services --cluster "$CLUSTER_NAME" --services "uw-waste-management-app" --region "$REGION" --query "services[0].serviceName" --output text 2>/dev/null || echo "")

if [ -z "$SERVICE_EXISTS" ]; then
  # Create new service
  echo "Creating new ECS service..."
  SERVICE_JSON=$(cat "$SERVICE_FILE" | sed "s/ENVIRONMENT/$ENVIRONMENT/g" | sed "s/REGION/$REGION/g" | sed "s/ACCOUNT_ID/$ACCOUNT_ID/g" | sed "s/REVISION/$TASK_REVISION/g")
  
  aws ecs create-service \
    --cluster "$CLUSTER_NAME" \
    --region "$REGION" \
    --cli-input-json "$SERVICE_JSON"
else
  # Update existing service
  echo "Updating existing ECS service..."
  aws ecs update-service \
    --cluster "$CLUSTER_NAME" \
    --service "uw-waste-management-app" \
    --task-definition "$TASK_DEF_ARN" \
    --force-new-deployment \
    --region "$REGION"
fi

echo "Deployment to ECS completed successfully!"
echo "Service: uw-waste-management-app"
echo "Cluster: $CLUSTER_NAME"
echo "Task Definition: $TASK_DEF_ARN"

# Wait for service to stabilize
echo "Waiting for service to stabilize..."
aws ecs wait services-stable \
  --cluster "$CLUSTER_NAME" \
  --services "uw-waste-management-app" \
  --region "$REGION"

echo "Service is now stable and ready!"