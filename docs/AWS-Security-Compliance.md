# AWS Security and Compliance Guide

**Version:** 1.0.0  
**Last Updated:** April 16, 2025  
**Author:** Bonaventure  
**Project:** UW Help App - Waste Management Platform

## Overview

This document outlines the security and compliance measures implemented in the AWS deployment of the UW Help App. It covers security best practices, compliance standards, data protection, access controls, and ongoing security maintenance procedures.

## Security Architecture

### Defense-in-Depth Strategy

The UW Help App implements a multi-layered security approach:

1. **Network Layer Security**
   - VPC isolation with public/private subnet segregation
   - Network ACLs for subnet-level traffic control
   - Security groups for instance-level access control
   - AWS Shield for DDoS protection

2. **Identity and Access Layer**
   - IAM roles with least privilege principle
   - AWS Organizations for multi-account management
   - AWS SSO for centralized access management
   - Role-based access control (RBAC)

3. **Application Layer Security**
   - Web Application Firewall (WAF) for HTTP traffic filtering
   - API Gateway with request validation and throttling
   - Input validation and sanitization
   - Output encoding to prevent XSS

4. **Data Layer Security**
   - Encryption at rest for all data stores
   - Encryption in transit for all communications
   - Key management via AWS KMS
   - Database activity monitoring

5. **Monitoring and Detection**
   - CloudTrail for API activity logging
   - CloudWatch for metric monitoring and alerting
   - AWS Config for resource configuration tracking
   - GuardDuty for threat detection

## IAM Configuration

### IAM Policies and Roles

| Role Name | Description | Attached Policies | Trusted Entities |
|-----------|-------------|-------------------|------------------|
| `uw-help-app-ecs-task-role` | Execution role for ECS tasks | `uw-help-app-task-policy` | ECS Tasks |
| `uw-help-app-build-role` | Role for CI/CD pipeline | `uw-help-app-build-policy` | GitHub Actions |
| `uw-help-app-admin-role` | Administrative role for the app | `uw-help-app-admin-policy` | Authorized Personnel |

### IAM Policy Examples

**ECS Task Policy:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:*:*:table/uw-help-app-*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::uw-help-app-*/*",
        "arn:aws:s3:::uw-help-app-*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:log-group:/aws/ecs/uw-help-app-*:*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "arn:aws:secretsmanager:*:*:secret:uw-help-app-*"
    }
  ]
}
```

### Secrets Management

Sensitive information is stored in AWS Secrets Manager:

- Database credentials
- API keys for external services
- OAuth client secrets
- Encryption keys

Secret rotation is automated:
- RDS credentials: Every 30 days
- API keys: Every 90 days
- Access tokens: Based on expiration

## Encryption Strategy

### Data at Rest Encryption

| Service | Encryption Method | Key Management |
|---------|-------------------|---------------|
| S3 | SSE-KMS | Customer managed CMK |
| DynamoDB | AWS owned keys | AWS managed |
| RDS | AWS KMS | Customer managed CMK |
| EBS Volumes | AWS KMS | Customer managed CMK |
| CloudWatch Logs | AWS KMS | Customer managed CMK |

### Data in Transit Encryption

- All APIs require HTTPS (TLS 1.2+)
- Internal service communication encrypted with TLS
- Load balancer listeners configured for HTTPS only
- Database connections require SSL/TLS

### Key Management

- KMS keys are rotated automatically every year
- Key policies restrict usage to specific services and roles
- Key usage is logged and monitored in CloudTrail
- Multi-Region keys are used for cross-region encryption needs

## Compliance Framework

### Compliance Standards

The UW Help App infrastructure is designed to meet the following compliance standards:

- ISO 27001 (Information Security Management)
- SOC 2 (Service Organization Controls)
- GDPR (General Data Protection Regulation)
- CCPA (California Consumer Privacy Act)
- FERPA (Family Educational Rights and Privacy Act) for educational institutions

### Audit and Reporting

- Security assessments conducted quarterly
- Vulnerability scanning performed weekly
- Penetration testing conducted annually
- Compliance audits scheduled according to requirements

### Documentation and Evidence

The following documentation is maintained for compliance purposes:

- System security plan (SSP)
- Risk assessment reports
- Vulnerability management program
- Incident response plan
- Backup and recovery procedures
- Configuration management plan

## Security Monitoring and Response

### Security Monitoring

The following monitoring systems are implemented:

1. **AWS Security Hub**
   - Aggregates security findings from multiple AWS services
   - Tracks compliance with security standards
   - Prioritizes findings based on severity

2. **Amazon GuardDuty**
   - Continuous threat detection
   - Monitors for suspicious activities
   - Machine learning-based anomaly detection

3. **AWS Config**
   - Monitors resource configurations
   - Evaluates against security best practices
   - Tracks configuration changes over time

4. **CloudWatch Alarms**
   - Login failure rate monitoring
   - Unusual API call patterns
   - Resource utilization anomalies
   - Error rate thresholds

### Incident Response

The incident response plan follows the NIST framework:

1. **Preparation**
   - Pre-defined playbooks for common incidents
   - Roles and responsibilities documented
   - Communication templates prepared

2. **Detection and Analysis**
   - Automated alerting for potential incidents
   - Log correlation and analysis
   - Impact assessment procedures

3. **Containment**
   - Automated and manual containment options
   - Isolation procedures for affected resources
   - Evidence preservation methods

4. **Eradication and Recovery**
   - Malware removal procedures
   - Secure rebuilding of affected systems
   - Data restoration from backups

5. **Post-Incident Activity**
   - Incident documentation
   - Root cause analysis
   - Lessons learned and improvements

## Vulnerability Management

### Security Patch Management

- **Operating System**: Automated patching via SSM Patch Manager
- **Container Images**: Scanned during CI/CD pipeline
- **Libraries/Dependencies**: Automated scanning and updates
- **AWS Services**: Managed automatically by AWS

### Vulnerability Scanning

The following scanning tools are used:

- **Container Scanning**: Amazon ECR image scanning
- **Code Scanning**: Static application security testing (SAST)
- **Dynamic Testing**: Dynamic application security testing (DAST)
- **Infrastructure Scanning**: AWS Inspector for EC2 instances

### Remediation Process

1. Vulnerabilities logged in tracking system
2. Risk assessment and prioritization
3. Development of remediation plan
4. Testing in non-production environment
5. Deployment to production
6. Verification and closure

## Network Security Controls

### Web Application Firewall (WAF)

The AWS WAF is configured with the following rule sets:

- **Core Rule Set**: Basic protection against common vulnerabilities
- **SQL Injection**: Protection against SQL injection attacks
- **Cross-Site Scripting**: Protection against XSS attacks
- **Geographic Restrictions**: Blocking traffic from high-risk countries
- **Rate Limiting**: Protection against brute force and DoS attacks

### DDoS Protection

- **AWS Shield Standard**: Basic protection included with all AWS services
- **AWS Shield Advanced**: Enhanced protection for mission-critical applications
- **CloudFront**: Edge mitigation of DDoS attacks
- **Auto Scaling**: Automatic scaling during traffic spikes

### VPN and Direct Connect

- Site-to-site VPN for secure access from on-premises
- AWS Direct Connect for high-bandwidth, low-latency access
- Client VPN for remote administrator access

## Identity and Authentication

### Cognito User Pools

- Multi-factor authentication (MFA) required for sensitive operations
- Password policies enforcing complexity requirements
- Account lockout after multiple failed attempts
- Customizable authentication flows

### Administrative Access

- AWS SSO for federated access to the AWS console
- Temporary credentials with short expiration times
- Conditional access policies based on location and device
- Session monitoring and termination capabilities

### API Authentication

- JWT-based authentication for all API endpoints
- Token validation with appropriate signature verification
- Short-lived access tokens with refresh capability
- Scope-based authorization for API operations

## Data Protection and Privacy

### Data Classification

| Data Category | Examples | Protection Level |
|---------------|----------|------------------|
| Public | Marketing materials, open documentation | Standard encryption |
| Internal | Non-sensitive operational data | Strong encryption with access controls |
| Confidential | User accounts, configuration data | Strong encryption with strict access controls |
| Sensitive | Personal information, location data | Maximum protection with anonymization |

### Privacy Controls

- Data minimization principles applied to all collections
- Explicit consent mechanisms for user data
- Data retention policies enforced through automation
- Data subject access request (DSAR) procedures

### Data Lifecycle Management

1. **Creation**: Classification and initial protection
2. **Storage**: Appropriate encryption and access controls
3. **Usage**: Logging and monitoring of access
4. **Sharing**: Secure transfer methods and recipient verification
5. **Archiving**: Secure long-term storage with continued protection
6. **Destruction**: Secure deletion with certification

## Backup and Recovery

### Backup Strategy

- **RDS**: Automated daily backups with 7-day retention
- **DynamoDB**: Point-in-time recovery enabled (35-day window)
- **S3**: Versioning enabled with lifecycle policies
- **EBS**: Daily snapshots with 30-day retention
- **Configuration**: AWS Backup for centralized management

### Disaster Recovery

- **Recovery Time Objective (RTO)**: < 4 hours for critical systems
- **Recovery Point Objective (RPO)**: < 1 hour for critical data
- **Multi-Region Strategy**: Cross-region replication for critical data
- **Recovery Testing**: Quarterly DR exercises

## Security Best Practices

### AWS Well-Architected Framework - Security Pillar

The implementation follows the AWS Well-Architected Framework's security best practices:

1. **Implement a strong identity foundation**
   - Centralized identity management
   - Principle of least privilege
   - Strong authentication mechanisms

2. **Enable traceability**
   - Comprehensive logging and monitoring
   - Real-time alerts for security events
   - Audit logs with tamper-proof storage

3. **Apply security at all layers**
   - Network, instance, application, and data security
   - Defense in depth strategy
   - Overlapping security controls

4. **Automate security best practices**
   - Infrastructure as code for security controls
   - Automated compliance checking
   - Automated remediation where possible

5. **Protect data in transit and at rest**
   - Consistent encryption standards
   - Key management with rotation
   - Data classification and handling procedures

6. **Keep people away from data**
   - Automated processes for routine tasks
   - Break-glass procedures for emergency access
   - Just-in-time access provisioning

7. **Prepare for security events**
   - Incident response automation
   - Regular security testing
   - Playbooks for common scenarios

## Security Governance

### Security Policies

- **Information Security Policy**: Overarching security principles
- **Access Control Policy**: Rules for granting and revoking access
- **Data Protection Policy**: Requirements for handling different data types
- **Acceptable Use Policy**: Guidelines for appropriate system usage
- **Incident Response Policy**: Procedures for security incidents

### Security Roles and Responsibilities

- **Security Team**: Overall security strategy and oversight
- **DevOps Team**: Implementation of security controls
- **Development Team**: Secure coding practices
- **Operations Team**: Secure system administration
- **End Users**: Following security guidelines and reporting incidents

### Continuous Improvement

- Regular security assessment and testing
- Security metrics tracked over time
- Lessons learned incorporated into processes
- Emerging threat intelligence integration

## Conclusion

The security and compliance architecture of the UW Help App follows best practices for cloud-native applications, with a comprehensive approach to protecting data, systems, and users. By implementing defense-in-depth strategies, continuous monitoring, and automated security controls, the application maintains a strong security posture while enabling necessary functionality and performance.

---

## Appendix: Security Tools and Resources

### AWS Security Tools

- AWS Security Hub
- Amazon GuardDuty
- AWS Config
- Amazon Inspector
- AWS CloudTrail
- AWS IAM Access Analyzer
- Amazon Macie
- AWS Firewall Manager

### Compliance Resources

- AWS Compliance Programs: https://aws.amazon.com/compliance/programs/
- AWS Compliance Center: https://aws.amazon.com/compliance/
- AWS Security Best Practices: https://aws.amazon.com/architecture/security-identity-compliance/

### Security Monitoring Commands

```bash
# View GuardDuty findings
aws guardduty list-findings --detector-id <detector-id>

# Check Security Hub findings
aws securityhub get-findings

# View Config compliance status
aws configservice get-compliance-details-by-config-rule \
  --config-rule-name <rule-name>

# View CloudTrail events
aws cloudtrail lookup-events --lookup-attributes \
  AttributeKey=EventName,AttributeValue=ConsoleLogin
```