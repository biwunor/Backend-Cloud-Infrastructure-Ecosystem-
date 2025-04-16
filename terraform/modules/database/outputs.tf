output "waste_items_table_name" {
  description = "Name of the waste items DynamoDB table"
  value       = aws_dynamodb_table.waste_items.name
}

output "waste_items_table_arn" {
  description = "ARN of the waste items DynamoDB table"
  value       = aws_dynamodb_table.waste_items.arn
}

output "locations_table_name" {
  description = "Name of the locations DynamoDB table"
  value       = aws_dynamodb_table.locations.name
}

output "locations_table_arn" {
  description = "ARN of the locations DynamoDB table"
  value       = aws_dynamodb_table.locations.arn
}

output "users_table_name" {
  description = "Name of the users DynamoDB table"
  value       = aws_dynamodb_table.users.name
}

output "users_table_arn" {
  description = "ARN of the users DynamoDB table"
  value       = aws_dynamodb_table.users.arn
}

output "statistics_table_name" {
  description = "Name of the statistics DynamoDB table"
  value       = aws_dynamodb_table.statistics.name
}

output "statistics_table_arn" {
  description = "ARN of the statistics DynamoDB table"
  value       = aws_dynamodb_table.statistics.arn
}