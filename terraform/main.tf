provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "UW-Help-App"
      Environment = terraform.workspace
      ManagedBy   = "Terraform"
    }
  }
}

# Remote state configuration (uncomment when ready to use)
terraform {
  backend "s3" {
    bucket         = "uw-help-app-terraform-state"
    key            = "terraform.tfstate"
    region         = "us-west-2"
    dynamodb_table = "uw-help-app-terraform-locks"
    encrypt        = true
  }
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  required_version = ">= 1.0.0"
}

locals {
  name_prefix = "uw-help-app-${terraform.workspace}"
  environment = terraform.workspace
  
  common_tags = {
    Project     = "Uw-Help-App"
    Environment = local.environment
    ManagedBy   = "Terraform"
  }
}

# Networking Module
module "networking" {
  source = "./modules/networking"
  
  name_prefix        = local.name_prefix
  vpc_cidr           = var.vpc_cidr
  availability_zones = var.availability_zones
  tags               = local.common_tags
}

# Security Module
module "security" {
  source = "./modules/security"
  
  name_prefix  = local.name_prefix
  vpc_id       = module.networking.vpc_id
  environment  = local.environment
  tags         = local.common_tags
}

# DynamoDB Module
module "database" {
  source = "./modules/database"
  
  name_prefix     = local.name_prefix
  environment     = local.environment
  billing_mode    = var.dynamodb_billing_mode
  read_capacity   = var.dynamodb_read_capacity
  write_capacity  = var.dynamodb_write_capacity
  tags            = local.common_tags
}

# RDS PostgreSQL Module
module "rds" {
  source = "./modules/rds"
  
  name_prefix               = local.name_prefix
  environment               = local.environment
  vpc_id                    = module.networking.vpc_id
  subnet_ids                = module.networking.private_subnet_ids
  allowed_security_group_ids = [module.security.ecs_security_group_id]
  
  # Database configuration
  instance_class            = lookup(var.rds_instance_classes, local.environment, "db.t4g.small")
  allocated_storage         = lookup(var.rds_allocated_storage, local.environment, 20)
  max_allocated_storage     = lookup(var.rds_max_allocated_storage, local.environment, 100)
  database_name             = var.database_name
  master_username           = var.database_username
  
  # High availability settings
  multi_az                  = local.environment == "prod" || local.environment == "staging"
  
  # Backup and maintenance
  backup_retention_period   = lookup(var.rds_backup_retention_days, local.environment, 7)
  performance_insights_enabled = local.environment != "dev"
  performance_insights_retention_period = local.environment == "prod" ? 731 : 7
  
  # Monitoring
  monitoring_interval       = local.environment == "dev" ? 60 : 30
  alarm_actions             = [aws_sns_topic.alerts.arn]
  ok_actions                = [aws_sns_topic.alerts.arn]
  max_connections           = lookup(var.rds_max_connections, local.environment, 100)
  
  tags                      = local.common_tags
}

# ECR Repository
resource "aws_ecr_repository" "app" {
  name                 = "${local.name_prefix}-repository"
  image_tag_mutability = "MUTABLE"
  
  image_scanning_configuration {
    scan_on_push = true
  }
  
  tags = local.common_tags
}

# ECS Module
module "ecs" {
  source = "./modules/ecs"
  
  name_prefix               = local.name_prefix
  vpc_id                    = module.networking.vpc_id
  subnet_ids                = module.networking.private_subnet_ids
  public_subnet_ids         = module.networking.public_subnet_ids
  ecs_task_execution_role_arn = module.security.ecs_task_execution_role_arn
  ecs_task_role_arn         = module.security.ecs_task_role_arn
  alb_security_group_id     = module.security.alb_security_group_id
  ecs_security_group_id     = module.security.ecs_security_group_id
  container_port            = var.container_port
  container_cpu             = var.container_cpu
  container_memory          = var.container_memory
  app_image                 = "${aws_ecr_repository.app.repository_url}:${var.app_image_tag}"
  app_count                 = var.app_count
  environment               = local.environment
  certificate_arn           = local.environment == "prod" ? module.dns_cdn[0].acm_certificate_arn : ""
  tags                      = local.common_tags
}

# S3 Bucket for static assets
resource "aws_s3_bucket" "static_assets" {
  count  = var.create_s3_static_assets ? 1 : 0
  bucket = "${local.name_prefix}-static-assets"
  
  tags = local.common_tags
}

resource "aws_s3_bucket_versioning" "static_assets" {
  count  = var.create_s3_static_assets ? 1 : 0
  bucket = aws_s3_bucket.static_assets[0].id
  
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "static_assets" {
  count  = var.create_s3_static_assets ? 1 : 0
  bucket = aws_s3_bucket.static_assets[0].id
  
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# DNS and CDN Module (only for production and staging)
module "dns_cdn" {
  count  = var.domain_name != "" ? 1 : 0
  source = "./modules/dns_cdn"
  
  name_prefix          = local.name_prefix
  domain_name          = var.domain_name
  create_route53_zone  = var.create_route53_zone
  alb_dns_name         = module.ecs.alb_dns_name
  alb_zone_id          = module.ecs.alb_zone_id
  s3_bucket_domain_name = var.create_s3_static_assets ? aws_s3_bucket.static_assets[0].bucket_regional_domain_name : null
  cloudfront_price_class = var.cloudfront_price_class
  create_app_subdomain = var.create_app_subdomain
  create_api_subdomain = var.create_api_subdomain
  tags                 = local.common_tags
}

# CloudWatch Dashboard
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${local.name_prefix}-dashboard"
  
  dashboard_body = jsonencode({
    widgets = [
      # ECS Metrics
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ECS", "CPUUtilization", "ServiceName", module.ecs.ecs_service_name, "ClusterName", module.ecs.ecs_cluster_name]
          ]
          period = 300
          stat   = "Average"
          region = var.aws_region
          title  = "ECS CPU Utilization"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ECS", "MemoryUtilization", "ServiceName", module.ecs.ecs_service_name, "ClusterName", module.ecs.ecs_cluster_name]
          ]
          period = 300
          stat   = "Average"
          region = var.aws_region
          title  = "ECS Memory Utilization"
        }
      },
      
      # ALB Metrics
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ApplicationELB", "RequestCount", "LoadBalancer", module.ecs.alb_arn]
          ]
          period = 300
          stat   = "Sum"
          region = var.aws_region
          title  = "ALB Request Count"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 6
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ApplicationELB", "TargetResponseTime", "LoadBalancer", module.ecs.alb_arn]
          ]
          period = 300
          stat   = "Average"
          region = var.aws_region
          title  = "ALB Response Time"
        }
      },
      
      # RDS Metrics
      {
        type   = "metric"
        x      = 0
        y      = 12
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/RDS", "CPUUtilization", "DBInstanceIdentifier", module.rds.db_instance_id]
          ]
          period = 300
          stat   = "Average"
          region = var.aws_region
          title  = "RDS CPU Utilization"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 12
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/RDS", "FreeStorageSpace", "DBInstanceIdentifier", module.rds.db_instance_id]
          ]
          period = 300
          stat   = "Average"
          region = var.aws_region
          title  = "RDS Free Storage Space"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 18
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/RDS", "DatabaseConnections", "DBInstanceIdentifier", module.rds.db_instance_id]
          ]
          period = 300
          stat   = "Average"
          region = var.aws_region
          title  = "RDS Database Connections"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 18
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/RDS", "ReadLatency", "DBInstanceIdentifier", module.rds.db_instance_id],
            ["AWS/RDS", "WriteLatency", "DBInstanceIdentifier", module.rds.db_instance_id]
          ]
          period = 300
          stat   = "Average"
          region = var.aws_region
          title  = "RDS Read/Write Latency"
        }
      },
      
      # DynamoDB Metrics
      {
        type   = "metric"
        x      = 0
        y      = 24
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/DynamoDB", "ConsumedReadCapacityUnits", "TableName", "${local.name_prefix}-waste-items-table"],
            ["AWS/DynamoDB", "ConsumedWriteCapacityUnits", "TableName", "${local.name_prefix}-waste-items-table"]
          ]
          period = 300
          stat   = "Sum"
          region = var.aws_region
          title  = "DynamoDB Consumed Capacity"
        }
      }
    ]
  })
}

# CloudWatch Alarms for monitoring
resource "aws_cloudwatch_metric_alarm" "cpu_utilization_high" {
  alarm_name          = "${local.name_prefix}-cpu-utilization-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "This alarm monitors ECS CPU utilization"
  
  dimensions = {
    ClusterName = module.ecs.ecs_cluster_name
    ServiceName = module.ecs.ecs_service_name
  }
  
  alarm_actions = [aws_sns_topic.alerts.arn]
  ok_actions    = [aws_sns_topic.alerts.arn]
  
  tags = local.common_tags
}

resource "aws_cloudwatch_metric_alarm" "memory_utilization_high" {
  alarm_name          = "${local.name_prefix}-memory-utilization-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/ECS"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "This alarm monitors ECS Memory utilization"
  
  dimensions = {
    ClusterName = module.ecs.ecs_cluster_name
    ServiceName = module.ecs.ecs_service_name
  }
  
  alarm_actions = [aws_sns_topic.alerts.arn]
  ok_actions    = [aws_sns_topic.alerts.arn]
  
  tags = local.common_tags
}

# SNS Topic for alerts
resource "aws_sns_topic" "alerts" {
  name = "${local.name_prefix}-alerts"
  
  tags = local.common_tags
}

# Optional: SNS Subscription for email alerts
resource "aws_sns_topic_subscription" "email_alerts" {
  count     = var.alert_email != "" ? 1 : 0
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}