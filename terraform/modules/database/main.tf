# DynamoDB table for waste items
resource "aws_dynamodb_table" "waste_items" {
  name         = "${var.name_prefix}-waste-items"
  billing_mode = var.billing_mode
  hash_key     = "id"
  
  attribute {
    name = "id"
    type = "S"
  }
  
  attribute {
    name = "userId"
    type = "S"
  }
  
  attribute {
    name = "locationId"
    type = "S"
  }
  
  attribute {
    name = "createdAt"
    type = "S"
  }
  
  global_secondary_index {
    name               = "UserIdIndex"
    hash_key           = "userId"
    range_key          = "createdAt"
    projection_type    = "ALL"
    read_capacity      = var.billing_mode == "PROVISIONED" ? var.read_capacity : null
    write_capacity     = var.billing_mode == "PROVISIONED" ? var.write_capacity : null
  }
  
  global_secondary_index {
    name               = "LocationIdIndex"
    hash_key           = "locationId"
    range_key          = "createdAt"
    projection_type    = "ALL"
    read_capacity      = var.billing_mode == "PROVISIONED" ? var.read_capacity : null
    write_capacity     = var.billing_mode == "PROVISIONED" ? var.write_capacity : null
  }
  
  tags = merge(
    var.tags,
    {
      Name = "${var.name_prefix}-waste-items"
    }
  )
  
  point_in_time_recovery {
    enabled = var.environment == "prod" ? true : false
  }
}

# DynamoDB table for locations
resource "aws_dynamodb_table" "locations" {
  name         = "${var.name_prefix}-locations"
  billing_mode = var.billing_mode
  hash_key     = "id"
  
  attribute {
    name = "id"
    type = "S"
  }
  
  attribute {
    name = "locationType"
    type = "S"
  }
  
  global_secondary_index {
    name               = "LocationTypeIndex"
    hash_key           = "locationType"
    projection_type    = "ALL"
    read_capacity      = var.billing_mode == "PROVISIONED" ? var.read_capacity : null
    write_capacity     = var.billing_mode == "PROVISIONED" ? var.write_capacity : null
  }
  
  tags = merge(
    var.tags,
    {
      Name = "${var.name_prefix}-locations"
    }
  )
  
  point_in_time_recovery {
    enabled = var.environment == "prod" ? true : false
  }
}

# DynamoDB table for users
resource "aws_dynamodb_table" "users" {
  name         = "${var.name_prefix}-users"
  billing_mode = var.billing_mode
  hash_key     = "id"
  
  attribute {
    name = "id"
    type = "S"
  }
  
  attribute {
    name = "email"
    type = "S"
  }
  
  global_secondary_index {
    name               = "EmailIndex"
    hash_key           = "email"
    projection_type    = "ALL"
    read_capacity      = var.billing_mode == "PROVISIONED" ? var.read_capacity : null
    write_capacity     = var.billing_mode == "PROVISIONED" ? var.write_capacity : null
  }
  
  tags = merge(
    var.tags,
    {
      Name = "${var.name_prefix}-users"
    }
  )
  
  point_in_time_recovery {
    enabled = var.environment == "prod" ? true : false
  }
}

# DynamoDB table for statistics
resource "aws_dynamodb_table" "statistics" {
  name         = "${var.name_prefix}-statistics"
  billing_mode = var.billing_mode
  hash_key     = "id"
  range_key    = "date"
  
  attribute {
    name = "id"
    type = "S"
  }
  
  attribute {
    name = "date"
    type = "S"
  }
  
  tags = merge(
    var.tags,
    {
      Name = "${var.name_prefix}-statistics"
    }
  )
  
  point_in_time_recovery {
    enabled = var.environment == "prod" ? true : false
  }
}