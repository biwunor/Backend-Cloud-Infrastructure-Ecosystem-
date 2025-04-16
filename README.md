# UW Help App - Waste Management Platform

![UW Help App Logo](generated-icon.png)

> A comprehensive waste management platform designed to empower the UW community through digital sustainability solutions.

**Version:** 1.0.0  
**Date:** April 16, 2025  
**Author:** Bonaventure  
**Project Lead:** Bonaventure  
**Project ID:** PROYNSMD

## Overview

The UW Help App is a cutting-edge waste management platform developed to streamline and enhance sustainability efforts across the University of Washington. This platform leverages modern cloud technology, containerized architecture, and location-based services to provide an intuitive and efficient waste disposal and tracking system for the UW community.

## Key Features

- **Interactive Waste Disposal Mapping**
  - Geolocation-based navigation to nearest appropriate disposal sites
  - Real-time availability updates for recycling and composting stations
  - Turn-by-turn campus directions to waste facilities

- **Waste Classification System**
  - AI-powered image recognition for waste type identification
  - Comprehensive database of disposable items with proper disposal methods
  - Educational content on waste sorting best practices

- **Community Engagement**
  - Gamification elements with sustainability achievements
  - Campus-wide waste reduction challenges and leaderboards
  - Social sharing of personal sustainability impact

- **Analytics Dashboard**
  - Individual waste disposal metrics and improvements
  - Departmental and building-level sustainability comparisons
  - Campus-wide waste diversion and reduction statistics

- **Administrator Tools**
  - Waste facility management and status updates
  - Problem reporting and maintenance workflow
  - Data export for sustainability reporting

## Technology Stack

### Frontend
- React.js with responsive design
- Geolocation services integration
- Progressive Web App (PWA) capabilities
- Mobile-first, accessible UI/UX

### Backend
- Node.js RESTful API architecture
- DynamoDB for scalable NoSQL data storage
- AWS Lambda for serverless processing
- JWT authentication and role-based access control

### DevOps & Infrastructure
- AWS ECS containerized deployment
- AWS Amplify for frontend hosting and authentication
- AWS RDS PostgreSQL for relational data storage
- VPC with public and private subnets for secure networking
- Terraform infrastructure as code (IaC)
- GitHub Actions CI/CD pipeline
- AWS CloudFront content delivery network
- Route 53 DNS management with custom domain
- CloudWatch monitoring and alerting
- Secrets Manager for secure credential management

## Architecture

The platform follows a modern cloud-native architecture with microservices running in containers, orchestrated by AWS ECS. The system is designed to be highly available, scalable, and secure.

```
┌─────────────────┐     ┌───────────────┐     ┌────────────────┐
│                 │     │               │     │                │
│  React Frontend │────▶│ API Gateway   │────▶│  ECS Services  │────┐
│                 │     │               │     │                │    │
└────────┬────────┘     └───────────────┘     └────────┬───────┘    │
         │                                             │            │
         │                                             ▼            ▼
┌────────▼────────┐     ┌───────────────┐     ┌────────────────┐   ┌────────────────┐
│                 │     │               │     │                │   │                │
│   AWS Amplify   │     │   Route 53    │     │    DynamoDB    │   │  PostgreSQL    │
│                 │     │               │     │    (NoSQL)     │   │     (RDS)      │
└────────┬────────┘     └───────┬───────┘     └────────────────┘   └────────────────┘
         │                      │                                          ▲
         ▼                      ▼                                          │
┌─────────────────┐     ┌───────────────┐     ┌────────────────┐          │
│                 │     │               │     │                │          │
│   CloudFront    │◀────│ Custom Domain │     │  Lambda Funcs  │──────────┘
│                 │     │               │     │                │
└─────────────────┘     └───────────────┘     └────────────────┘
```

All components run in a secure VPC with public and private subnets, managed through Terraform.

## Getting Started

### Prerequisites

- Node.js 20.x or later
- AWS Account with appropriate permissions
- Docker and Docker Compose for local development
- Terraform 1.0.0+ for infrastructure deployment
- GitHub account for CI/CD integration

### Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-organization/uw-help-app.git
   cd uw-help-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp environments/template.env .env
   # Edit .env with your configuration
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Access the application at http://localhost:3000

### Backend API Documentation

The backend API follows RESTful principles and provides the following key endpoints:

- `GET /api/waste` - Retrieve waste items with filtering options
- `POST /api/waste` - Add a new waste item
- `GET /api/locations` - Get disposal locations with filtering
- `GET /api/users/:id/statistics` - Retrieve user-specific waste statistics
- `POST /api/auth/login` - Authenticate user and retrieve JWT token

Detailed API documentation is available in the [API Documentation](docs/API.md) file.

## Deployment

The platform supports multiple deployment options, with the primary method being AWS ECS through our Terraform-based Infrastructure as Code (IaC).

### Deployment Environments

- **Development (dev)**: For ongoing development and testing
- **Staging**: For pre-production validation
- **Production (prod)**: For the live production environment

### Deployment Methods

1. **GitHub Actions (Recommended)**:
   Automated CI/CD pipeline that builds, tests, and deploys the application based on branch changes.

2. **Manual Terraform Deployment**:
   Direct infrastructure provisioning and application deployment using Terraform commands.

3. **Deployment Script**:
   Simplified deployment using the included `scripts/deploy.sh` script.

For detailed deployment instructions, please refer to the [Deployment Guide](DEPLOYMENT.md).

## Project Structure

```
uw-help-app/
├── .github/                   # GitHub Actions workflows and templates
├── amplify/                   # AWS Amplify configuration
│   ├── backend/               # Amplify backend resources
│   │   ├── api/               # AppSync GraphQL API definition
│   │   ├── auth/              # Cognito authentication resources
│   │   ├── function/          # Lambda functions
│   │   └── storage/           # S3 and DynamoDB resources
│   ├── .config/               # Amplify configuration files
│   └── team-provider-info.json# Environment-specific settings
├── backend/                   # Backend API and services
│   ├── api/                   # API routes and controllers
│   ├── config/                # Configuration files
│   ├── database/              # Database models and connections
│   ├── middleware/            # Express middleware
│   └── tests/                 # Backend tests
├── Cloud/                     # Cloud deployment resources
│   ├── aws/                   # AWS-specific configuration
│   ├── docker/                # Docker configuration
│   ├── github-pages/          # GitHub Pages deployment
│   └── netlify/               # Netlify deployment (alternative)
├── scripts/                   # Utility scripts
├── terraform/                 # Infrastructure as Code
│   ├── modules/               # Terraform modules
│   │   ├── database/          # DynamoDB resources
│   │   ├── dns_cdn/           # Route 53 and CloudFront
│   │   ├── ecs/               # ECS container orchestration
│   │   ├── networking/        # VPC, subnets, gateways
│   │   ├── rds/               # PostgreSQL RDS configuration
│   │   └── security/          # IAM, security groups
│   ├── main.tf                # Main Terraform configuration
│   └── variables.tf           # Terraform variables
├── docs/                      # Documentation
└── amplify.yml                # Amplify build specification
```

## Team

- **Bonaventure** - Project Lead, DevOps Architect
- Jane Doe - Backend Developer
- John Smith - Frontend Developer
- Alice Johnson - UI/UX Designer
- Bob Brown - QA Engineer

## Contributing

We welcome contributions from the University of Washington community. Please review our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- UW Sustainability Office
- UW Information Technology Services
- UW Facilities Services
- The open-source community for providing valuable tools and libraries

## Contact

For questions, support, or feedback, please contact:

**Bonaventure**  
Project Lead  
Email: proynsmd@example.com  

University of Washington  
Seattle, WA, USA