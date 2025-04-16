#!/bin/bash
set -e

# Default values
ENVIRONMENT="dev"
AWS_REGION="us-west-2"
TASK_REVISION="latest"
DESIRED_COUNT=1
ENABLE_EXECUTE_COMMAND="true"
IMAGE_TAG="latest"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    --environment)
      ENVIRONMENT="$2"
      shift
      shift
      ;;
    --region)
      AWS_REGION="$2"
      shift
      shift
      ;;
    --account)
      AWS_ACCOUNT_ID="$2"
      shift
      shift
      ;;
    --task-revision)
      TASK_REVISION="$2"
      shift
      shift
      ;;
    --desired-count)
      DESIRED_COUNT="$2"
      shift
      shift
      ;;
    --enable-execute-command)
      ENABLE_EXECUTE_COMMAND="$2"
      shift
      shift
      ;;
    --image-tag)
      IMAGE_TAG="$2"
      shift
      shift
      ;;
    --api-url)
      API_URL="$2"
      shift
      shift
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Validate required parameters
if [ -z "$AWS_ACCOUNT_ID" ]; then
  echo "Error: AWS Account ID is required. Use --account parameter."
  exit 1
fi

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Deploying UW Waste Management Application to ECS"
echo "================================================"
echo "Environment: $ENVIRONMENT"
echo "AWS Region: $AWS_REGION"
echo "AWS Account ID: $AWS_ACCOUNT_ID"
echo "Task Definition Revision: $TASK_REVISION"
echo "Desired Count: $DESIRED_COUNT"
echo "Image Tag: $IMAGE_TAG"

# Get or create ECR repository
ECR_REPOSITORY_NAME="uw-waste-management"
ECR_REPOSITORY_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY_NAME}"

echo "Checking if ECR repository exists..."
if ! aws ecr describe-repositories --repository-names "$ECR_REPOSITORY_NAME" --region "$AWS_REGION" &> /dev/null; then
  echo "Creating ECR repository..."
  aws ecr create-repository --repository-name "$ECR_REPOSITORY_NAME" --region "$AWS_REGION"
fi
echo "ECR Repository URI: $ECR_REPOSITORY_URI"

# Get CloudFormation outputs
echo "Getting CloudFormation stack outputs..."
STACK_NAME="uw-waste-management-${ENVIRONMENT}"
STACK_OUTPUTS=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --region "$AWS_REGION" --query "Stacks[0].Outputs" --output json)

# Parse relevant outputs
VPC_ID=$(echo "$STACK_OUTPUTS" | jq -r '.[] | select(.OutputKey=="VpcId") | .OutputValue')
if [ -z "$VPC_ID" ] || [ "$VPC_ID" == "null" ]; then
  echo "Error: VPC ID not found in CloudFormation outputs. Please ensure the CloudFormation stack is correctly set up."
  exit 1
fi
echo "VPC ID: $VPC_ID"

# Get subnet IDs
echo "Getting subnet IDs..."
SUBNET_IDS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query "Subnets[?MapPublicIpOnLaunch==\`true\`].SubnetId" --output json --region "$AWS_REGION")
echo "Subnet IDs: $SUBNET_IDS"

# Get or create security group
SG_NAME="uw-waste-management-${ENVIRONMENT}-sg"
echo "Checking if security group exists..."
SECURITY_GROUP_ID=$(aws ec2 describe-security-groups --filters "Name=group-name,Values=$SG_NAME" "Name=vpc-id,Values=$VPC_ID" --query "SecurityGroups[0].GroupId" --output text --region "$AWS_REGION")
if [ "$SECURITY_GROUP_ID" == "None" ]; then
  echo "Creating security group..."
  SECURITY_GROUP_ID=$(aws ec2 create-security-group --group-name "$SG_NAME" --description "Security group for UW Waste Management ECS services" --vpc-id "$VPC_ID" --region "$AWS_REGION" --output text --query "GroupId")
  
  # Allow inbound HTTP and HTTPS
  aws ec2 authorize-security-group-ingress --group-id "$SECURITY_GROUP_ID" --protocol tcp --port 80 --cidr 0.0.0.0/0 --region "$AWS_REGION"
  aws ec2 authorize-security-group-ingress --group-id "$SECURITY_GROUP_ID" --protocol tcp --port 443 --cidr 0.0.0.0/0 --region "$AWS_REGION"
  aws ec2 authorize-security-group-ingress --group-id "$SECURITY_GROUP_ID" --protocol tcp --port 3000 --cidr 0.0.0.0/0 --region "$AWS_REGION"
fi
echo "Security Group ID: $SECURITY_GROUP_ID"
SECURITY_GROUP_IDS="[\"$SECURITY_GROUP_ID\"]"

# Get or create ECS cluster
echo "Checking if ECS cluster exists..."
CLUSTER_NAME="uw-waste-management-${ENVIRONMENT}"
if ! aws ecs describe-clusters --clusters "$CLUSTER_NAME" --region "$AWS_REGION" --query "clusters[0]" &> /dev/null; then
  echo "Creating ECS cluster..."
  aws ecs create-cluster --cluster-name "$CLUSTER_NAME" --capacity-providers FARGATE FARGATE_SPOT --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1 --region "$AWS_REGION"
fi
echo "ECS Cluster: $CLUSTER_NAME"

# Create or update CloudWatch log groups
echo "Creating CloudWatch log groups..."
aws logs create-log-group --log-group-name "/ecs/uw-waste-management-frontend-${ENVIRONMENT}" --region "$AWS_REGION" || true
aws logs create-log-group --log-group-name "/ecs/uw-waste-management-backend-${ENVIRONMENT}" --region "$AWS_REGION" || true

# Set log retention policy
echo "Setting log retention policy..."
aws logs put-retention-policy --log-group-name "/ecs/uw-waste-management-frontend-${ENVIRONMENT}" --retention-in-days 30 --region "$AWS_REGION"
aws logs put-retention-policy --log-group-name "/ecs/uw-waste-management-backend-${ENVIRONMENT}" --retention-in-days 30 --region "$AWS_REGION"

# Get or create load balancer
LB_NAME="uw-waste-management-${ENVIRONMENT}"
echo "Checking if load balancer exists..."
LB_ARN=$(aws elbv2 describe-load-balancers --names "$LB_NAME" --query "LoadBalancers[0].LoadBalancerArn" --output text --region "$AWS_REGION" 2>/dev/null || echo "")
if [ -z "$LB_ARN" ] || [ "$LB_ARN" == "None" ]; then
  echo "Creating load balancer..."
  LB_ARN=$(aws elbv2 create-load-balancer --name "$LB_NAME" --subnets $(echo "$SUBNET_IDS" | jq -r '.[]') --security-groups "$SECURITY_GROUP_ID" --scheme internet-facing --type application --region "$AWS_REGION" --query "LoadBalancers[0].LoadBalancerArn" --output text)
fi
echo "Load Balancer ARN: $LB_ARN"

# Create target groups if they don't exist
echo "Creating target groups..."
TG_NAME="uw-waste-management-frontend-${ENVIRONMENT}"
TG_ARN=$(aws elbv2 describe-target-groups --names "$TG_NAME" --query "TargetGroups[0].TargetGroupArn" --output text --region "$AWS_REGION" 2>/dev/null || echo "")
if [ -z "$TG_ARN" ] || [ "$TG_ARN" == "None" ]; then
  echo "Creating frontend target group..."
  TG_ARN=$(aws elbv2 create-target-group --name "$TG_NAME" --protocol HTTP --port 80 --vpc-id "$VPC_ID" --target-type ip --health-check-path "/" --health-check-interval-seconds 30 --health-check-timeout-seconds 5 --healthy-threshold-count 2 --unhealthy-threshold-count 3 --region "$AWS_REGION" --query "TargetGroups[0].TargetGroupArn" --output text)
fi
echo "Frontend Target Group ARN: $TG_ARN"

API_TG_NAME="uw-waste-management-backend-${ENVIRONMENT}"
API_TG_ARN=$(aws elbv2 describe-target-groups --names "$API_TG_NAME" --query "TargetGroups[0].TargetGroupArn" --output text --region "$AWS_REGION" 2>/dev/null || echo "")
if [ -z "$API_TG_ARN" ] || [ "$API_TG_ARN" == "None" ]; then
  echo "Creating backend target group..."
  API_TG_ARN=$(aws elbv2 create-target-group --name "$API_TG_NAME" --protocol HTTP --port 3000 --vpc-id "$VPC_ID" --target-type ip --health-check-path "/health" --health-check-interval-seconds 30 --health-check-timeout-seconds 5 --healthy-threshold-count 2 --unhealthy-threshold-count 3 --region "$AWS_REGION" --query "TargetGroups[0].TargetGroupArn" --output text)
fi
echo "Backend Target Group ARN: $API_TG_ARN"

# Create listeners if they don't exist
echo "Creating listeners..."
HTTP_LISTENER_ARN=$(aws elbv2 describe-listeners --load-balancer-arn "$LB_ARN" --query "Listeners[?Port==\`80\`].ListenerArn" --output text --region "$AWS_REGION" 2>/dev/null || echo "")
if [ -z "$HTTP_LISTENER_ARN" ] || [ "$HTTP_LISTENER_ARN" == "None" ]; then
  echo "Creating HTTP listener..."
  HTTP_LISTENER_ARN=$(aws elbv2 create-listener --load-balancer-arn "$LB_ARN" --protocol HTTP --port 80 --default-actions Type=forward,TargetGroupArn=$TG_ARN --region "$AWS_REGION" --query "Listeners[0].ListenerArn" --output text)
fi

# Add API listener rule
echo "Creating API listener rule..."
aws elbv2 describe-rules --listener-arn "$HTTP_LISTENER_ARN" --query "Rules[?Priority!='default']" --region "$AWS_REGION" | grep -q "/api" || \
aws elbv2 create-rule --listener-arn "$HTTP_LISTENER_ARN" --priority 10 --conditions Field=path-pattern,Values="/api/*" --actions Type=forward,TargetGroupArn=$API_TG_ARN --region "$AWS_REGION"

# Get or create Service Discovery namespace
NAMESPACE_NAME="uw-waste-management-local"
echo "Checking if Service Discovery namespace exists..."
NAMESPACE_ID=$(aws servicediscovery list-namespaces --query "Namespaces[?Name=='$NAMESPACE_NAME'].Id" --output text --region "$AWS_REGION" 2>/dev/null || echo "")
if [ -z "$NAMESPACE_ID" ] || [ "$NAMESPACE_ID" == "None" ]; then
  echo "Creating Service Discovery namespace..."
  NAMESPACE_ID=$(aws servicediscovery create-private-dns-namespace --name "$NAMESPACE_NAME" --vpc "$VPC_ID" --region "$AWS_REGION" --query "OperationId" --output text)
  aws servicediscovery wait operation-success --operation-id "$NAMESPACE_ID" --region "$AWS_REGION"
  NAMESPACE_ID=$(aws servicediscovery list-namespaces --query "Namespaces[?Name=='$NAMESPACE_NAME'].Id" --output text --region "$AWS_REGION")
fi
echo "Service Discovery Namespace ID: $NAMESPACE_ID"

# Get or create Service Discovery service
SERVICE_DISCOVERY_NAME="backend-${ENVIRONMENT}"
echo "Checking if Service Discovery service exists..."
SERVICE_DISCOVERY_ID=$(aws servicediscovery list-services --query "Services[?Name=='$SERVICE_DISCOVERY_NAME'].Id" --output text --region "$AWS_REGION" 2>/dev/null || echo "")
if [ -z "$SERVICE_DISCOVERY_ID" ] || [ "$SERVICE_DISCOVERY_ID" == "None" ]; then
  echo "Creating Service Discovery service..."
  SERVICE_DISCOVERY_ID=$(aws servicediscovery create-service --name "$SERVICE_DISCOVERY_NAME" --dns-config "NamespaceId=$NAMESPACE_ID,DnsRecords=[{Type=A,TTL=60}]" --health-check-custom-config "FailureThreshold=1" --region "$AWS_REGION" --query "Service.Id" --output text)
fi
SERVICE_DISCOVERY_ARN=$(aws servicediscovery get-service --id "$SERVICE_DISCOVERY_ID" --region "$AWS_REGION" --query "Service.Arn" --output text)
echo "Service Discovery Service ARN: $SERVICE_DISCOVERY_ARN"

# Create task role if it doesn't exist
TASK_ROLE_NAME="uw-waste-management-task-role"
echo "Checking if task role exists..."
TASK_ROLE_ARN=$(aws iam get-role --role-name "$TASK_ROLE_NAME" --query "Role.Arn" --output text 2>/dev/null || echo "")
if [ -z "$TASK_ROLE_ARN" ] || [ "$TASK_ROLE_ARN" == "None" ]; then
  echo "Creating task role..."
  aws iam create-role --role-name "$TASK_ROLE_NAME" --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"ecs-tasks.amazonaws.com"},"Action":"sts:AssumeRole"}]}' --region "$AWS_REGION"
  aws iam attach-role-policy --role-name "$TASK_ROLE_NAME" --policy-arn "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess" --region "$AWS_REGION"
  aws iam attach-role-policy --role-name "$TASK_ROLE_NAME" --policy-arn "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess" --region "$AWS_REGION"
  aws iam attach-role-policy --role-name "$TASK_ROLE_NAME" --policy-arn "arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess" --region "$AWS_REGION"
  TASK_ROLE_ARN=$(aws iam get-role --role-name "$TASK_ROLE_NAME" --query "Role.Arn" --output text)
fi
echo "Task Role ARN: $TASK_ROLE_ARN"

# Create parameter store parameters if they don't exist
echo "Creating parameter store parameters..."
PARAM_PATH="/uw-waste-management/${ENVIRONMENT}/jwt-secret"
aws ssm describe-parameters --parameter-filters "Key=Name,Values=$PARAM_PATH" --region "$AWS_REGION" | grep -q "$PARAM_PATH" || \
aws ssm put-parameter --name "$PARAM_PATH" --type SecureString --value "dummy-jwt-secret-replace-me" --region "$AWS_REGION"

PARAM_PATH="/uw-waste-management/${ENVIRONMENT}/map-api-key"
aws ssm describe-parameters --parameter-filters "Key=Name,Values=$PARAM_PATH" --region "$AWS_REGION" | grep -q "$PARAM_PATH" || \
aws ssm put-parameter --name "$PARAM_PATH" --type SecureString --value "dummy-map-api-key-replace-me" --region "$AWS_REGION"

# Prepare and register task definition
echo "Preparing task definition..."
TASK_DEF_FILE="${SCRIPT_DIR}/ecs-task-definition.json"
TMP_TASK_DEF_FILE=$(mktemp)

# If API URL is not provided, use the load balancer DNS name
if [ -z "$API_URL" ]; then
  LB_DNS_NAME=$(aws elbv2 describe-load-balancers --load-balancer-arns "$LB_ARN" --query "LoadBalancers[0].DNSName" --output text --region "$AWS_REGION")
  API_URL="http://${LB_DNS_NAME}/api"
fi
echo "API URL: $API_URL"

# Replace variables in task definition
cat "$TASK_DEF_FILE" | \
  sed "s|\${AWS_ACCOUNT_ID}|$AWS_ACCOUNT_ID|g" | \
  sed "s|\${AWS_REGION}|$AWS_REGION|g" | \
  sed "s|\${ENVIRONMENT}|$ENVIRONMENT|g" | \
  sed "s|\${ECR_REPOSITORY_URI}|$ECR_REPOSITORY_URI|g" | \
  sed "s|\${IMAGE_TAG}|$IMAGE_TAG|g" | \
  sed "s|\${API_URL}|$API_URL|g" \
  > "$TMP_TASK_DEF_FILE"

echo "Registering task definition..."
TASK_DEF_ARN=$(aws ecs register-task-definition --cli-input-json "file://${TMP_TASK_DEF_FILE}" --region "$AWS_REGION" --query "taskDefinition.taskDefinitionArn" --output text)
echo "Task Definition ARN: $TASK_DEF_ARN"
TASK_REVISION=$(echo "$TASK_DEF_ARN" | cut -d':' -f 7)
echo "Task Revision: $TASK_REVISION"

# Prepare and create/update ECS service
echo "Preparing service definition..."
SERVICE_DEF_FILE="${SCRIPT_DIR}/ecs-service-definition.json"
TMP_SERVICE_DEF_FILE=$(mktemp)

# Replace variables in service definition
cat "$SERVICE_DEF_FILE" | \
  sed "s|\${ENVIRONMENT}|$ENVIRONMENT|g" | \
  sed "s|\${TASK_REVISION}|$TASK_REVISION|g" | \
  sed "s|\${TARGET_GROUP_ARN}|$TG_ARN|g" | \
  sed "s|\${API_TARGET_GROUP_ARN}|$API_TG_ARN|g" | \
  sed "s|\${DESIRED_COUNT}|$DESIRED_COUNT|g" | \
  sed "s|\${SUBNET_IDS}|$SUBNET_IDS|g" | \
  sed "s|\${SECURITY_GROUP_IDS}|$SECURITY_GROUP_IDS|g" | \
  sed "s|\${ENABLE_EXECUTE_COMMAND}|$ENABLE_EXECUTE_COMMAND|g" | \
  sed "s|\${SERVICE_DISCOVERY_ARN}|$SERVICE_DISCOVERY_ARN|g" \
  > "$TMP_SERVICE_DEF_FILE"

# Check if service exists
SERVICE_NAME="uw-waste-management-service-${ENVIRONMENT}"
SERVICE_EXISTS=$(aws ecs describe-services --cluster "$CLUSTER_NAME" --services "$SERVICE_NAME" --region "$AWS_REGION" --query "services[0].status" --output text 2>/dev/null || echo "MISSING")

if [ "$SERVICE_EXISTS" == "ACTIVE" ]; then
  echo "Updating ECS service..."
  aws ecs update-service --cluster "$CLUSTER_NAME" --service "$SERVICE_NAME" --task-definition "uw-waste-management:${TASK_REVISION}" --desired-count "$DESIRED_COUNT" --force-new-deployment --region "$AWS_REGION"
else
  echo "Creating ECS service..."
  aws ecs create-service --cli-input-json "file://${TMP_SERVICE_DEF_FILE}" --region "$AWS_REGION"
fi

echo "Cleaning up temporary files..."
rm -f "$TMP_TASK_DEF_FILE" "$TMP_SERVICE_DEF_FILE"

echo "Done! ECS deployment completed successfully."
echo "Your application should be available at: http://$(aws elbv2 describe-load-balancers --load-balancer-arns "$LB_ARN" --query "LoadBalancers[0].DNSName" --output text --region "$AWS_REGION")"
echo "API should be available at: http://$(aws elbv2 describe-load-balancers --load-balancer-arns "$LB_ARN" --query "LoadBalancers[0].DNSName" --output text --region "$AWS_REGION")/api"