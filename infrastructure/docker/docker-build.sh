#!/bin/bash

# Docker build and deployment script for UW Waste Management App

set -e

# Default values
ENVIRONMENT="dev"
TAG="latest"
REGISTRY=""
PUSH=false
ECR=false

# Display help
function show_help {
  echo "Usage: $0 [options]"
  echo "Options:"
  echo "  -e, --environment    Environment: dev, staging, prod (default: dev)"
  echo "  -t, --tag            Docker image tag (default: latest)"
  echo "  -r, --registry       Docker registry URL (default: none)"
  echo "  -p, --push           Push image to registry (default: false)"
  echo "  --ecr                Use AWS ECR as registry (default: false)"
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
    -t|--tag)
      TAG="$2"
      shift 2
      ;;
    -r|--registry)
      REGISTRY="$2"
      shift 2
      ;;
    -p|--push)
      PUSH=true
      shift
      ;;
    --ecr)
      ECR=true
      shift
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

# Set image name
IMAGE_NAME="uw-waste-management"
FULL_TAG="${IMAGE_NAME}:${ENVIRONMENT}-${TAG}"

if [ -n "$REGISTRY" ]; then
  FULL_IMAGE_NAME="${REGISTRY}/${FULL_TAG}"
else
  FULL_IMAGE_NAME="${FULL_TAG}"
fi

# Build different targets based on environment
if [ "$ENVIRONMENT" == "dev" ]; then
  TARGET="development"
  COMPOSE_FILE="docker-compose.yml"
else
  TARGET="production"
  COMPOSE_FILE="docker-compose.prod.yml"
fi

echo "Building Docker image: $FULL_IMAGE_NAME"
echo "Environment: $ENVIRONMENT"
echo "Target: $TARGET"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  echo "Error: Docker is not installed. Please install it first."
  exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
  echo "Error: docker-compose is not installed. Please install it first."
  exit 1
fi

# Configure AWS ECR if needed
if [ "$ECR" = true ]; then
  if ! command -v aws &> /dev/null; then
    echo "Error: AWS CLI is not installed. Please install it first."
    exit 1
  fi
  
  # Get ECR login credentials
  echo "Logging in to AWS ECR..."
  AWS_REGION=$(aws configure get region || echo "us-west-2")
  AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
  
  if [ -z "$REGISTRY" ]; then
    REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    FULL_IMAGE_NAME="${REGISTRY}/${FULL_TAG}"
  fi
  
  # Create repository if it doesn't exist
  aws ecr describe-repositories --repository-names "${IMAGE_NAME}" > /dev/null 2>&1 || \
    aws ecr create-repository --repository-name "${IMAGE_NAME}" > /dev/null
  
  # Login to ECR
  aws ecr get-login-password --region "${AWS_REGION}" | \
    docker login --username AWS --password-stdin "${REGISTRY}"
fi

# Build the Docker image
echo "Building Docker image..."
docker build \
  --target "${TARGET}" \
  -t "${FULL_IMAGE_NAME}" \
  -f Dockerfile \
  ../../

# Run docker-compose with the specified environment
echo "Starting containers with docker-compose..."
cd "$(dirname "$0")"
docker-compose -f "${COMPOSE_FILE}" up -d

# Push the image if requested
if [ "$PUSH" = true ]; then
  echo "Pushing image to registry: ${FULL_IMAGE_NAME}"
  docker push "${FULL_IMAGE_NAME}"
fi

echo "Docker build and deployment completed successfully!"