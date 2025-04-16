/**
 * RDS PostgreSQL Module Variables for Africa Help App
 * 
 * Variables for configuring the PostgreSQL RDS instance.
 * 
 * Author: Bonaventure
 * Last Updated: April 16, 2025
 */

variable "name_prefix" {
  description = "Prefix for resource names"
  type        = string
  default     = "africa-help-app"
}

variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
}

variable "vpc_id" {
  description = "ID of the VPC where the RDS instance will be deployed"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs for the DB subnet group (should be private subnets)"
  type        = list(string)
}

variable "allowed_security_group_ids" {
  description = "List of security group IDs allowed to access the RDS instance"
  type        = list(string)
}

variable "master_username" {
  description = "Username for the master DB user"
  type        = string
  default     = "postgres"
}

variable "database_name" {
  description = "Name of the initial database to create"
  type        = string
  default     = "africaHelpApp"
}

variable "engine_version" {
  description = "PostgreSQL engine version"
  type        = string
  default     = "13.7"
}

variable "instance_class" {
  description = "Instance class for the RDS instance"
  type        = string
  default     = "db.t4g.medium"
}

variable "allocated_storage" {
  description = "Allocated storage size in GB"
  type        = number
  default     = 20
}

variable "max_allocated_storage" {
  description = "Maximum storage allocation in GB for storage autoscaling"
  type        = number
  default     = 100
}

variable "multi_az" {
  description = "Whether to deploy a multi-AZ RDS instance"
  type        = bool
  default     = false
}

variable "backup_retention_period" {
  description = "Number of days to retain backups"
  type        = number
  default     = 7
}

variable "backup_window" {
  description = "Preferred backup window (UTC)"
  type        = string
  default     = "02:00-04:00"
}

variable "maintenance_window" {
  description = "Preferred maintenance window (UTC)"
  type        = string
  default     = "sun:04:00-sun:06:00"
}

variable "kms_key_id" {
  description = "ARN of the KMS key for encryption (if null, AWS managed key is used)"
  type        = string
  default     = null
}

variable "monitoring_interval" {
  description = "Interval in seconds for enhanced monitoring (0 to disable)"
  type        = number
  default     = 60
}

variable "monitoring_role_arn" {
  description = "ARN of the IAM role for enhanced monitoring"
  type        = string
  default     = null
}

variable "performance_insights_enabled" {
  description = "Whether to enable Performance Insights"
  type        = bool
  default     = true
}

variable "performance_insights_retention_period" {
  description = "Retention period for Performance Insights in days (7 for free tier, 731 for long term)"
  type        = number
  default     = 7
}

variable "max_connections" {
  description = "Maximum number of database connections"
  type        = number
  default     = 100
}

variable "alarm_actions" {
  description = "List of ARNs for alarm actions (e.g., SNS topic)"
  type        = list(string)
  default     = []
}

variable "ok_actions" {
  description = "List of ARNs for alarm OK actions"
  type        = list(string)
  default     = []
}

variable "tags" {
  description = "Additional tags for all resources"
  type        = map(string)
  default     = {}
}