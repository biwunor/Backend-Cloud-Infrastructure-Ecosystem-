variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of availability zones"
  type        = list(string)
  default     = ["us-west-2a", "us-west-2b", "us-west-2c"]
}

variable "container_port" {
  description = "Port exposed by the container"
  type        = number
  default     = 4000
}

variable "container_cpu" {
  description = "CPU units for the container"
  type        = number
  default     = 512 # 0.5 vCPU
}

variable "container_memory" {
  description = "Memory for the container in MiB"
  type        = number
  default     = 1024 # 1 GB
}

variable "app_count" {
  description = "Number of app instances to run"
  type        = number
  default     = 2
}

variable "app_image_tag" {
  description = "Docker image tag for the application"
  type        = string
  default     = "latest"
}

variable "dynamodb_billing_mode" {
  description = "DynamoDB billing mode"
  type        = string
  default     = "PAY_PER_REQUEST" # Use PROVISIONED for production with specific requirements
}

variable "dynamodb_read_capacity" {
  description = "DynamoDB read capacity (used if billing_mode is PROVISIONED)"
  type        = number
  default     = 5
}

variable "dynamodb_write_capacity" {
  description = "DynamoDB write capacity (used if billing_mode is PROVISIONED)"
  type        = number
  default     = 5
}

variable "create_s3_static_assets" {
  description = "Whether to create an S3 bucket for static assets"
  type        = bool
  default     = true
}

variable "domain_name" {
  description = "Domain name for the application (e.g., example.com)"
  type        = string
  default     = ""
}

variable "create_route53_zone" {
  description = "Whether to create a new Route 53 hosted zone"
  type        = bool
  default     = false
}

variable "cloudfront_price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_100" # Use PriceClass_All for global distribution
}

variable "create_app_subdomain" {
  description = "Whether to create an app subdomain"
  type        = bool
  default     = false
}

variable "create_api_subdomain" {
  description = "Whether to create an api subdomain"
  type        = bool
  default     = false
}

variable "alert_email" {
  description = "Email address for CloudWatch alerts"
  type        = string
  default     = ""
}