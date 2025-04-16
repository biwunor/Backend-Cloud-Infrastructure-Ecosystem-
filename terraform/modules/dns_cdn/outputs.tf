output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution"
  value       = aws_cloudfront_distribution.main.id
}

output "cloudfront_distribution_domain_name" {
  description = "Domain name of the CloudFront distribution"
  value       = aws_cloudfront_distribution.main.domain_name
}

output "cloudfront_distribution_arn" {
  description = "ARN of the CloudFront distribution"
  value       = aws_cloudfront_distribution.main.arn
}

output "acm_certificate_arn" {
  description = "ARN of the ACM certificate"
  value       = aws_acm_certificate.main.arn
}

output "route53_zone_id" {
  description = "ID of the Route 53 zone"
  value       = local.zone_id
}

output "domain_name" {
  description = "Domain name of the application"
  value       = var.domain_name
}

output "app_url" {
  description = "URL of the application"
  value       = "https://${var.domain_name}"
}

output "app_subdomain_url" {
  description = "URL of the app subdomain (if created)"
  value       = var.create_app_subdomain ? "https://app.${var.domain_name}" : null
}

output "api_subdomain_url" {
  description = "URL of the API subdomain (if created)"
  value       = var.create_api_subdomain ? "https://api.${var.domain_name}" : null
}