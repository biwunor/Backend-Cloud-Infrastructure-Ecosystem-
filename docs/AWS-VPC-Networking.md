# AWS VPC and Networking Architecture Guide

**Version:** 1.0.0  
**Last Updated:** April 16, 2025  
**Author:** Bonaventure  
**Project:** UW Help App - Waste Management Platform

## Overview

This document provides a detailed reference for the AWS VPC (Virtual Private Cloud) and networking architecture implemented for the UW Help App. The design follows AWS best practices to create a secure, scalable, and highly available infrastructure.

## VPC Architecture

### VPC Design Principles

Our VPC architecture follows these core principles:

1. **Security**: Isolation of resources through network segmentation
2. **High Availability**: Distribution across multiple Availability Zones
3. **Scalability**: Network architecture that can grow with the application
4. **Performance**: Optimized routing for minimal latency
5. **Cost Efficiency**: Balanced approach to resource allocation

### Network Layout

| Resource Type | CIDR Range | Description |
|---------------|------------|-------------|
| VPC | 10.0.0.0/16 | Main VPC containing all resources |
| Public Subnets | 10.0.1.0/24, 10.0.2.0/24, 10.0.3.0/24 | For public-facing resources (ALB, NAT Gateways) |
| Private App Subnets | 10.0.11.0/24, 10.0.12.0/24, 10.0.13.0/24 | For application services (ECS tasks) |
| Private Database Subnets | 10.0.21.0/24, 10.0.22.0/24, 10.0.23.0/24 | For database instances (RDS) |

### Availability Zone Distribution

Each subnet type is distributed across three Availability Zones in the selected region (us-west-2 by default):

- **us-west-2a**: Contains one public, one private app, and one private database subnet
- **us-west-2b**: Contains one public, one private app, and one private database subnet
- **us-west-2c**: Contains one public, one private app, and one private database subnet

This distribution ensures high availability and fault tolerance.

## Network Components

### Internet Gateway

- Provides internet access for resources in public subnets
- Enables outbound internet access from private subnets via NAT gateways
- Attached directly to the VPC

### NAT Gateways

- Deployed in each public subnet (3 total)
- Enables outbound internet access for private subnets
- Each NAT Gateway has an Elastic IP address
- Configured for high availability (one per AZ)

### Route Tables

| Route Table | Associated Subnets | Routes |
|-------------|-------------------|--------|
| Public Route Table | Public Subnets | Local traffic (10.0.0.0/16) → VPC<br>External traffic (0.0.0.0/0) → Internet Gateway |
| Private App Route Tables (3) | Private App Subnets | Local traffic (10.0.0.0/16) → VPC<br>External traffic (0.0.0.0/0) → NAT Gateway in same AZ |
| Private DB Route Tables (3) | Private Database Subnets | Local traffic (10.0.0.0/16) → VPC<br>External traffic (0.0.0.0/0) → NAT Gateway in same AZ |

### Network ACLs

| NACL | Associated Subnets | Inbound Rules | Outbound Rules |
|------|-------------------|---------------|----------------|
| Public NACL | Public Subnets | Allow HTTP/HTTPS from anywhere<br>Allow ephemeral ports from anywhere<br>Allow SSH from management CIDR | Allow all outbound traffic |
| Private App NACL | Private App Subnets | Allow traffic from VPC CIDR<br>Allow ephemeral ports from public subnets | Allow all outbound traffic |
| Private DB NACL | Private Database Subnets | Allow DB port from private app subnets<br>Allow ephemeral ports from private app subnets | Allow outbound to private app subnets<br>Allow ephemeral ports to private app subnets |

## Security Groups

### Application Load Balancer Security Group

- **Name**: `{environment}-alb-sg`
- **Inbound Rules**:
  - HTTP (80) from anywhere → Redirected to HTTPS
  - HTTPS (443) from anywhere
- **Outbound Rules**:
  - All traffic to ECS security group

### ECS Security Group

- **Name**: `{environment}-ecs-sg`
- **Inbound Rules**:
  - Application port (4000) from ALB security group
- **Outbound Rules**:
  - All traffic to anywhere (for application functionality)
  - Database port to RDS security group

### RDS Security Group

- **Name**: `{environment}-rds-sg`
- **Inbound Rules**:
  - PostgreSQL port (5432) from ECS security group
- **Outbound Rules**:
  - Limited response traffic to ECS security group

### Redis Security Group (if used)

- **Name**: `{environment}-redis-sg`
- **Inbound Rules**:
  - Redis port (6379) from ECS security group
- **Outbound Rules**:
  - Limited response traffic to ECS security group

## VPC Endpoints

To enhance security and reduce data transfer costs, the following VPC endpoints are implemented:

### Gateway Endpoints

- **S3 Endpoint**: Enables private connectivity to S3 buckets
  - Route table associations: All private subnet route tables
  - Policy: Restricted to specific buckets and actions

- **DynamoDB Endpoint**: Enables private connectivity to DynamoDB tables
  - Route table associations: All private subnet route tables
  - Policy: Restricted to specific tables and actions

### Interface Endpoints

- **ECR API Endpoint**: Private access to Amazon ECR API
  - Subnets: Private app subnets
  - Security group: Restricted to ECS security group

- **ECR Docker Endpoint**: Private access to Amazon ECR Docker registry
  - Subnets: Private app subnets
  - Security group: Restricted to ECS security group

- **CloudWatch Logs Endpoint**: Private access to CloudWatch Logs
  - Subnets: Private app subnets
  - Security group: Restricted to ECS security group

- **Secrets Manager Endpoint**: Private access to Secrets Manager
  - Subnets: Private app subnets
  - Security group: Restricted to ECS and RDS security groups

## Network Flow

### External Access Flow

1. User makes request to the application
2. Request is routed to CloudFront
3. CloudFront forwards request to Application Load Balancer
4. ALB routes request to an ECS task in a private app subnet
5. ECS task processes the request, potentially accessing:
   - RDS database in a private database subnet
   - S3 bucket via VPC endpoint
   - DynamoDB table via VPC endpoint
6. Response follows the reverse path back to the user

### Internal Service Flow

1. ECS task needs to access AWS APIs
2. Request is routed through the appropriate VPC endpoint
3. No traffic leaves the AWS network, enhancing security and performance

### Internet Access Flow

1. ECS task needs to access external API
2. Request is routed to the NAT Gateway in the same AZ
3. NAT Gateway forwards request to the Internet Gateway
4. Response follows the reverse path back to the ECS task

## DNS Configuration

### Route 53 Integration

- **Hosted Zone**: Main domain for the application
- **Record Sets**:
  - Main domain (apex) → CloudFront distribution
  - www subdomain → CloudFront distribution
  - api subdomain → Application Load Balancer (optional)

### DNS Resolution

- **VPC DNS Settings**:
  - enableDnsSupport: true
  - enableDnsHostnames: true

- **DNS Hostnames**: Enabled for all instances in the VPC

## Implementation in Terraform

The VPC and networking components are implemented using Terraform in the `terraform/modules/networking` directory:

### Key Files

- `main.tf`: Primary VPC, subnets, and connectivity resources
- `endpoints.tf`: VPC endpoints for AWS services
- `variables.tf`: Input variables for customization
- `outputs.tf`: Output values for reference by other modules

### Example Deployment

```hcl
module "networking" {
  source = "./modules/networking"
  
  name_prefix        = "uw-help-app-${terraform.workspace}"
  vpc_cidr           = "10.0.0.0/16"
  availability_zones = ["us-west-2a", "us-west-2b", "us-west-2c"]
  
  public_subnet_cidrs     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  private_app_subnet_cidrs = ["10.0.11.0/24", "10.0.12.0/24", "10.0.13.0/24"]
  private_db_subnet_cidrs  = ["10.0.21.0/24", "10.0.22.0/24", "10.0.23.0/24"]
  
  enable_vpc_endpoints    = true
  enable_nat_gateway      = true
  single_nat_gateway      = terraform.workspace == "dev" ? true : false
  
  tags = {
    Environment = terraform.workspace
    Project     = "UW-Help-App"
    ManagedBy   = "Terraform"
  }
}
```

## Network Monitoring and Troubleshooting

### CloudWatch Metrics

The following CloudWatch metrics are monitored:

- VPC Flow Logs: Traffic patterns and security analysis
- NAT Gateway metrics: ConnectionAttemptCount, ErrorPortAllocation
- VPC endpoint metrics: Bytes, Packets, PacketDropCount

### Flow Logs

VPC Flow Logs are configured with the following settings:

- **Format**: AWS Default format with additional fields
- **Destination**: CloudWatch Logs
- **Filter**: All traffic (Accept and Reject)
- **Retention**: 14 days

### Troubleshooting Tools

1. **Network Reachability Analyzer**:
   - Used for validating connectivity between resources
   - Helpful for diagnosing security group and NACL issues

2. **VPC Peering Diagnostics**:
   - For troubleshooting cross-VPC communication issues
   - Useful when integrating with other systems

3. **Route Table Analysis**:
   - Verification of correct routing configuration
   - Identifying potential routing conflicts

## Security Best Practices

1. **Principle of Least Privilege**:
   - Network ACLs and security groups allow only necessary traffic
   - Resources are placed in appropriate subnet tiers based on access needs

2. **Defense in Depth**:
   - Multiple security layers: NACLs, security groups, and application-level controls
   - Critical resources isolated in private subnets

3. **Encryption in Transit**:
   - All communication uses TLS/SSL
   - VPC endpoints secure AWS service communication

4. **Regular Security Audits**:
   - Security group and NACL rules are reviewed regularly
   - VPC Flow Logs are analyzed for unusual patterns

## Disaster Recovery Considerations

### Multi-AZ Design

- All critical resources are distributed across multiple AZs
- Automatic failover capabilities for high availability

### Cross-Region Strategy

For production environments, a disaster recovery strategy includes:

- Cross-region VPC peering or Transit Gateway for inter-region communication
- Region-to-region backup and restore procedures
- DNS failover using Route 53 health checks

## Scaling Considerations

The VPC architecture is designed to scale in the following ways:

1. **Subnet Sizing**:
   - CIDR blocks allow for significant growth
   - Each subnet can support thousands of instances

2. **NAT Gateway Scaling**:
   - Each NAT Gateway supports up to 55,000 simultaneous connections
   - Additional NAT Gateways can be deployed if needed

3. **VPC Endpoint Capacity**:
   - Scales automatically with demand
   - No specific capacity planning required

## Conclusion

The VPC and networking architecture for the UW Help App provides a secure, scalable foundation for the application infrastructure. By following AWS best practices for network segmentation, high availability, and security, the design ensures reliable operation while maintaining cost efficiency.

---

## Appendix: Network Diagram

```
                                                 │
                                                 ▼
                                         ┌───────────────┐
                                         │   Internet    │
                                         └───────┬───────┘
                                                 │
                                                 ▼
┌─────────────────────────────────────┐  ┌───────────────┐  ┌─────────────────────────────────────┐
│           CloudFront CDN            │◀─┤ Route 53 DNS  │─▶│        S3 Static Website            │
└─────────────────┬───────────────────┘  └───────────────┘  └─────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ VPC (10.0.0.0/16)                                                                               │
│  ┌─────────────────────────┐   ┌─────────────────────────┐   ┌─────────────────────────────────┐│
│  │     Availability Zone A  │   │     Availability Zone B  │   │     Availability Zone C        ││
│  │  ┌───────────────────┐  │   │  ┌───────────────────┐  │   │  ┌───────────────────┐         ││
│  │  │  Public Subnet    │  │   │  │  Public Subnet    │  │   │  │  Public Subnet    │         ││
│  │  │  (10.0.1.0/24)    │  │   │  │  (10.0.2.0/24)    │  │   │  │  (10.0.3.0/24)    │         ││
│  │  │  ┌─────────────┐  │  │   │  │  ┌─────────────┐  │  │   │  │  ┌─────────────┐  │         ││
│  │  │  │     ALB     │  │  │   │  │  │     ALB     │  │  │   │  │  │     ALB     │  │         ││
│  │  │  └─────────────┘  │  │   │  │  └─────────────┘  │  │   │  │  └─────────────┘  │         ││
│  │  │  ┌─────────────┐  │  │   │  │  ┌─────────────┐  │  │   │  │  ┌─────────────┐  │         ││
│  │  │  │     NAT     │  │  │   │  │  │     NAT     │  │  │   │  │  │     NAT     │  │         ││
│  │  │  └─────────────┘  │  │   │  │  └─────────────┘  │  │   │  │  └─────────────┘  │         ││
│  │  └───────────────────┘  │   │  └───────────────────┘  │   │  └───────────────────┘         ││
│  │                         │   │                         │   │                                 ││
│  │  ┌───────────────────┐  │   │  ┌───────────────────┐  │   │  ┌───────────────────┐         ││
│  │  │  Private App      │  │   │  │  Private App      │  │   │  │  Private App      │         ││
│  │  │  Subnet           │  │   │  │  Subnet           │  │   │  │  Subnet           │         ││
│  │  │  (10.0.11.0/24)   │  │   │  │  (10.0.12.0/24)   │  │   │  │  (10.0.13.0/24)   │         ││
│  │  │  ┌─────────────┐  │  │   │  │  ┌─────────────┐  │  │   │  │  ┌─────────────┐  │         ││
│  │  │  │ ECS Fargate │  │  │   │  │  │ ECS Fargate │  │  │   │  │  │ ECS Fargate │  │         ││
│  │  │  └─────────────┘  │  │   │  │  └─────────────┘  │  │   │  │  └─────────────┘  │         ││
│  │  │  ┌─────────────┐  │  │   │  │  ┌─────────────┐  │  │   │  │  ┌─────────────┐  │         ││
│  │  │  │VPC Endpoints│  │  │   │  │  │VPC Endpoints│  │  │   │  │  │VPC Endpoints│  │         ││
│  │  │  └─────────────┘  │  │   │  │  └─────────────┘  │  │   │  │  └─────────────┘  │         ││
│  │  └───────────────────┘  │   │  └───────────────────┘  │   │  └───────────────────┘         ││
│  │                         │   │                         │   │                                 ││
│  │  ┌───────────────────┐  │   │  ┌───────────────────┐  │   │  ┌───────────────────┐         ││
│  │  │  Private DB       │  │   │  │  Private DB       │  │   │  │  Private DB       │         ││
│  │  │  Subnet           │  │   │  │  Subnet           │  │   │  │  Subnet           │         ││
│  │  │  (10.0.21.0/24)   │  │   │  │  (10.0.22.0/24)   │  │   │  │  (10.0.23.0/24)   │         ││
│  │  │  ┌─────────────┐  │  │   │  │  ┌─────────────┐  │  │   │  │  ┌─────────────┐  │         ││
│  │  │  │     RDS     │  │  │   │  │  │     RDS     │  │  │   │  │  │     RDS     │  │         ││
│  │  │  │  (Primary)  │  │  │   │  │  │ (Standby)   │  │  │   │  │  │   (Spare)   │  │         ││
│  │  │  └─────────────┘  │  │   │  │  └─────────────┘  │  │   │  │  └─────────────┘  │         ││
│  │  └───────────────────┘  │   │  └───────────────────┘  │   │  └───────────────────┘         ││
│  └─────────────────────────┘   └─────────────────────────┘   └─────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
     │                                │                                  │
     ▼                                ▼                                  ▼
┌──────────┐                     ┌──────────┐                      ┌────────────┐
│ S3 via   │                     │ DynamoDB │                      │ AWS Services│
│ Endpoint │                     │ Endpoint │                      │ via Endpoints│
└──────────┘                     └──────────┘                      └────────────┘
```

## Appendix B: Common AWS Network CLI Commands

### VPC Inspection

```bash
# List VPCs
aws ec2 describe-vpcs

# List subnets
aws ec2 describe-subnets --filters "Name=vpc-id,Values=vpc-12345678"

# List route tables
aws ec2 describe-route-tables --filters "Name=vpc-id,Values=vpc-12345678"

# List NAT gateways
aws ec2 describe-nat-gateways --filter "Name=vpc-id,Values=vpc-12345678"

# List VPC endpoints
aws ec2 describe-vpc-endpoints --filters "Name=vpc-id,Values=vpc-12345678"
```

### Security Group Management

```bash
# List security groups
aws ec2 describe-security-groups --filters "Name=vpc-id,Values=vpc-12345678"

# View specific security group rules
aws ec2 describe-security-group-rules --filter "Name=group-id,Values=sg-12345678"
```

### Flow Logs

```bash
# Create flow logs
aws ec2 create-flow-logs \
  --resource-type VPC \
  --resource-ids vpc-12345678 \
  --traffic-type ALL \
  --log-destination-type cloud-watch-logs \
  --log-destination "arn:aws:logs:region:account-id:log-group:flow-logs"

# View flow logs
aws ec2 describe-flow-logs --filter "Name=resource-id,Values=vpc-12345678"
```