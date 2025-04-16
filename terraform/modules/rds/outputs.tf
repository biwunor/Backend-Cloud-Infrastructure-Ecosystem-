/**
 * RDS PostgreSQL Module Outputs for UW Help App
 * 
 * Output values exposed by the RDS module.
 * 
 * Author: Bonaventure
 * Last Updated: April 16, 2025
 */

output "db_instance_id" {
  description = "The RDS instance ID"
  value       = aws_db_instance.postgres.id
}

output "db_instance_address" {
  description = "The address of the RDS instance"
  value       = aws_db_instance.postgres.address
}

output "db_instance_endpoint" {
  description = "The connection endpoint of the RDS instance"
  value       = aws_db_instance.postgres.endpoint
}

output "db_instance_port" {
  description = "The database port"
  value       = aws_db_instance.postgres.port
}

output "db_instance_name" {
  description = "The database name"
  value       = aws_db_instance.postgres.db_name
}

output "db_instance_username" {
  description = "The master username for the database"
  value       = aws_db_instance.postgres.username
  sensitive   = true
}

output "db_instance_arn" {
  description = "The ARN of the RDS instance"
  value       = aws_db_instance.postgres.arn
}

output "db_subnet_group_id" {
  description = "The DB subnet group ID"
  value       = aws_db_subnet_group.postgres.id
}

output "db_subnet_group_arn" {
  description = "The ARN of the DB subnet group"
  value       = aws_db_subnet_group.postgres.arn
}

output "db_parameter_group_id" {
  description = "The DB parameter group ID"
  value       = aws_db_parameter_group.postgres.id
}

output "db_parameter_group_arn" {
  description = "The ARN of the DB parameter group"
  value       = aws_db_parameter_group.postgres.arn
}

output "db_security_group_id" {
  description = "The security group ID"
  value       = aws_security_group.postgres.id
}

output "db_security_group_arn" {
  description = "The ARN of the security group"
  value       = aws_security_group.postgres.arn
}

output "db_credentials_secret_arn" {
  description = "The ARN of the secrets manager secret containing database credentials"
  value       = aws_secretsmanager_secret.postgres_credentials.arn
}

output "connection_string_secretsmanager_arn" {
  description = "ARN of the Secrets Manager secret containing the database connection string"
  value       = aws_secretsmanager_secret.postgres_credentials.arn
}

output "jdbc_connection_string" {
  description = "JDBC connection string for connecting to the database"
  value       = "jdbc:postgresql://${aws_db_instance.postgres.endpoint}/${aws_db_instance.postgres.db_name}"
  sensitive   = true
}

output "instance_class" {
  description = "The RDS instance class"
  value       = aws_db_instance.postgres.instance_class
}

output "cloudwatch_alarms" {
  description = "Map of CloudWatch alarms created for the RDS instance"
  value = {
    cpu_utilization     = aws_cloudwatch_metric_alarm.cpu_utilization_high.id
    free_storage_space  = aws_cloudwatch_metric_alarm.free_storage_space_low.id
    database_connections = aws_cloudwatch_metric_alarm.database_connections_high.id
  }
}