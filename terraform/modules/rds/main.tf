/**
 * RDS PostgreSQL Module for UW Help App
 * 
 * This module creates a PostgreSQL RDS instance with multi-AZ support,
 * appropriate security groups, subnet groups, and parameter groups.
 * 
 * Author: Bonaventure
 * Last Updated: April 16, 2025
 */

locals {
  name_prefix = "${var.name_prefix}-postgres"
  tags = merge(
    {
      Name        = local.name_prefix
      Environment = var.environment
      Project     = "UW-Help-App"
      ManagedBy   = "Terraform"
    },
    var.tags
  )
}

# Random password for PostgreSQL master user
resource "random_password" "master_password" {
  length           = 16
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

# Store PostgreSQL credentials in Secrets Manager
resource "aws_secretsmanager_secret" "postgres_credentials" {
  name        = "${local.name_prefix}-credentials-${var.environment}"
  description = "PostgreSQL credentials for UW Help App ${var.environment} environment"
  tags        = local.tags
}

resource "aws_secretsmanager_secret_version" "postgres_credentials" {
  secret_id = aws_secretsmanager_secret.postgres_credentials.id
  secret_string = jsonencode({
    username            = var.master_username
    password            = random_password.master_password.result
    engine              = "postgres"
    host                = aws_db_instance.postgres.address
    port                = aws_db_instance.postgres.port
    dbname              = var.database_name
    dbInstanceIdentifier = aws_db_instance.postgres.id
  })
}

# Security group for PostgreSQL access
resource "aws_security_group" "postgres" {
  name        = "${local.name_prefix}-sg-${var.environment}"
  description = "Security group for PostgreSQL RDS instance - ${var.environment}"
  vpc_id      = var.vpc_id

  # PostgreSQL port access from application security group
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = var.allowed_security_group_ids
    description     = "PostgreSQL access from application security groups"
  }

  # Outbound access is limited to responses
  egress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = var.allowed_security_group_ids
    description     = "Response traffic to application security groups"
  }

  tags = merge(
    {
      Name = "${local.name_prefix}-sg-${var.environment}"
    },
    local.tags
  )
}

# DB subnet group using provided private subnets
resource "aws_db_subnet_group" "postgres" {
  name        = "${local.name_prefix}-subnet-group-${var.environment}"
  description = "Database subnet group for PostgreSQL RDS - ${var.environment}"
  subnet_ids  = var.subnet_ids

  tags = merge(
    {
      Name = "${local.name_prefix}-subnet-group-${var.environment}"
    },
    local.tags
  )
}

# Custom parameter group for PostgreSQL
resource "aws_db_parameter_group" "postgres" {
  name        = "${local.name_prefix}-params-${var.environment}"
  family      = "postgres13"
  description = "Custom parameter group for PostgreSQL RDS - ${var.environment}"

  # Security parameters
  parameter {
    name  = "rds.force_ssl"
    value = "1"
  }

  # Logging parameters
  parameter {
    name  = "log_connections"
    value = "1"
  }

  parameter {
    name  = "log_disconnections"
    value = "1"
  }

  parameter {
    name  = "log_statement"
    value = "ddl"
  }

  # Performance parameters
  parameter {
    name  = "shared_buffers"
    value = var.environment == "prod" ? "{DBInstanceClassMemory/4}" : "{DBInstanceClassMemory/8}"
  }

  parameter {
    name  = "work_mem"
    value = var.environment == "prod" ? "16384" : "4096"
  }

  tags = merge(
    {
      Name = "${local.name_prefix}-params-${var.environment}"
    },
    local.tags
  )
}

# PostgreSQL RDS instance
resource "aws_db_instance" "postgres" {
  identifier           = "${local.name_prefix}-${var.environment}"
  engine               = "postgres"
  engine_version       = var.engine_version
  instance_class       = var.instance_class
  allocated_storage    = var.allocated_storage
  max_allocated_storage = var.max_allocated_storage
  storage_type         = "gp3"
  storage_encrypted    = true
  kms_key_id           = var.kms_key_id
  
  # Credentials
  username             = var.master_username
  password             = random_password.master_password.result
  db_name              = var.database_name
  
  # Network configuration
  db_subnet_group_name = aws_db_subnet_group.postgres.name
  vpc_security_group_ids = [aws_security_group.postgres.id]
  publicly_accessible  = false
  multi_az             = var.multi_az
  
  # Maintenance and backup
  backup_retention_period = var.backup_retention_period
  backup_window           = var.backup_window
  maintenance_window      = var.maintenance_window
  copy_tags_to_snapshot   = true
  delete_automated_backups = var.environment == "prod" ? false : true
  deletion_protection     = var.environment == "prod" ? true : false
  skip_final_snapshot     = var.environment == "prod" ? false : true
  final_snapshot_identifier = var.environment == "prod" ? "${local.name_prefix}-final-snapshot-${var.environment}" : null
  
  # Performance and monitoring
  parameter_group_name = aws_db_parameter_group.postgres.name
  monitoring_interval  = var.monitoring_interval
  monitoring_role_arn  = var.monitoring_role_arn
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
  performance_insights_enabled = var.performance_insights_enabled
  performance_insights_retention_period = var.performance_insights_retention_period
  
  # Lifecycle
  auto_minor_version_upgrade = true
  apply_immediately          = var.environment == "prod" ? false : true
  
  tags = merge(
    {
      Name = "${local.name_prefix}-${var.environment}"
    },
    local.tags
  )
  
  # Avoid replacing the instance when the password changes
  lifecycle {
    ignore_changes = [password]
  }
}

# CloudWatch alarms for RDS monitoring
resource "aws_cloudwatch_metric_alarm" "cpu_utilization_high" {
  alarm_name          = "${local.name_prefix}-cpu-utilization-high-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "3"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors RDS CPU utilization"
  alarm_actions       = var.alarm_actions
  ok_actions          = var.ok_actions
  
  dimensions = {
    DBInstanceIdentifier = aws_db_instance.postgres.id
  }
  
  tags = local.tags
}

resource "aws_cloudwatch_metric_alarm" "free_storage_space_low" {
  alarm_name          = "${local.name_prefix}-free-storage-space-low-${var.environment}"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "3"
  metric_name         = "FreeStorageSpace"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = var.allocated_storage * 1024 * 1024 * 1024 * 0.1  # 10% of allocated storage in bytes
  alarm_description   = "This metric monitors RDS free storage space"
  alarm_actions       = var.alarm_actions
  ok_actions          = var.ok_actions
  
  dimensions = {
    DBInstanceIdentifier = aws_db_instance.postgres.id
  }
  
  tags = local.tags
}

resource "aws_cloudwatch_metric_alarm" "database_connections_high" {
  alarm_name          = "${local.name_prefix}-database-connections-high-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "3"
  metric_name         = "DatabaseConnections"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = var.max_connections * 0.8  # 80% of max connections
  alarm_description   = "This metric monitors RDS connection count"
  alarm_actions       = var.alarm_actions
  ok_actions          = var.ok_actions
  
  dimensions = {
    DBInstanceIdentifier = aws_db_instance.postgres.id
  }
  
  tags = local.tags
}