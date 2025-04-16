variable "name_prefix" {
  description = "Prefix for resource names"
  type        = string
}

variable "domain_name" {
  description = "Domain name for the application (e.g., example.com)"
  type        = string
}

variable "create_route53_zone" {
  description = "Whether to create a new Route 53 hosted zone"
  type        = bool
  default     = false
}

variable "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  type        = string
}

variable "alb_zone_id" {
  description = "Zone ID of the Application Load Balancer"
  type        = string
}

variable "s3_bucket_domain_name" {
  description = "Domain name of the S3 bucket for static assets (optional)"
  type        = string
  default     = null
}

variable "cloudfront_price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_100" # Use PriceClass_All for global distribution
}

variable "edge_lambda_arns" {
  description = "List of Lambda@Edge function configurations"
  type = list(object({
    event_type   = string
    lambda_arn   = string
    include_body = bool
  }))
  default = []
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

variable "tags" {
  description = "Common tags for resources"
  type        = map(string)
  default     = {}
}