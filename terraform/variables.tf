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

# RDS PostgreSQL Variables
variable "database_name" {
  description = "PostgreSQL database name"
  type        = string
  default     = "uwHelpApp"
}

variable "database_username" {
  description = "PostgreSQL master username"
  type        = string
  default     = "postgres"
}

variable "rds_instance_classes" {
  description = "Map of environment to RDS instance class"
  type        = map(string)
  default     = {
    dev     = "db.t4g.small"
    staging = "db.t4g.medium"
    prod    = "db.m6g.large"
  }
}

variable "rds_allocated_storage" {
  description = "Map of environment to allocated storage size in GB"
  type        = map(number)
  default     = {
    dev     = 20
    staging = 50
    prod    = 100
  }
}

variable "rds_max_allocated_storage" {
  description = "Map of environment to maximum storage allocation in GB for autoscaling"
  type        = map(number)
  default     = {
    dev     = 100
    staging = 200
    prod    = 500
  }
}

variable "rds_backup_retention_days" {
  description = "Map of environment to backup retention period in days"
  type        = map(number)
  default     = {
    dev     = 1
    staging = 3
    prod    = 7
  }
}

variable "rds_max_connections" {
  description = "Map of environment to maximum number of database connections"
  type        = map(number)
  default     = {
    dev     = 100
    staging = 200
    prod    = 500
  }
}