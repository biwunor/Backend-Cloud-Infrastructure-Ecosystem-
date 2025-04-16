# Contributing to UW Help App

First of all, thank you for considering contributing to the UW Help App! This is a community-driven project that aims to make waste management more efficient across the University of Washington. Your contributions help make this platform better for everyone.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
   - [Project Setup](#project-setup)
   - [Development Workflow](#development-workflow)
3. [How to Contribute](#how-to-contribute)
   - [Reporting Bugs](#reporting-bugs)
   - [Suggesting Enhancements](#suggesting-enhancements)
   - [Code Contributions](#code-contributions)
4. [Pull Request Process](#pull-request-process)
5. [Style Guides](#style-guides)
   - [Git Commit Messages](#git-commit-messages)
   - [JavaScript Style Guide](#javascript-style-guide)
   - [Documentation Style Guide](#documentation-style-guide)
6. [Community](#community)
7. [Project Governance](#project-governance)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [proynsmd@example.com](mailto:proynsmd@example.com).

## Getting Started

### Project Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/uw-help-app.git
   cd uw-help-app
   ```
3. Add the original repository as an upstream remote:
   ```bash
   git remote add upstream https://github.com/original-org/uw-help-app.git
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Set up your environment variables:
   ```bash
   cp environments/template.env .env
   # Edit .env with your development configuration
   ```

### Development Workflow

1. Make sure you're working with the latest code:
   ```bash
   git checkout main
   git pull upstream main
   ```
2. Create a new branch for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit them using the [conventional commits format](#git-commit-messages)
4. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Create a pull request from your branch to the main repository

## How to Contribute

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

**Before Submitting A Bug Report:**
- Check the [existing issues](https://github.com/your-organization/uw-help-app/issues) to see if the problem has already been reported
- Make sure you're using the latest version of the software
- Perform a quick search to see if the problem has already been reported

**How to Submit A Good Bug Report:**

Bugs are tracked as GitHub issues. Create an issue and provide the following information:

- Use a clear and descriptive title
- Describe the exact steps to reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed and what you expected to see
- Include screenshots or animated GIFs if possible
- If relevant, include code samples or error logs
- Specify your environment (OS, browser, Node.js version, etc.)

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion, including completely new features and minor improvements to existing functionality.

**Before Submitting An Enhancement Suggestion:**
- Check if the enhancement has already been suggested or implemented
- Check if the feature aligns with the project's goals and scope
- Consider whether your idea would be better as a separate application

**How to Submit A Good Enhancement Suggestion:**

Enhancement suggestions are tracked as GitHub issues. Create an issue and provide the following information:

- Use a clear and descriptive title
- Provide a detailed description of the proposed enhancement
- Explain why this enhancement would be useful to most users
- Specify the use cases this would address
- List any references or examples from other applications, if applicable
- Include mockups or screenshots if it helps visualize the idea

### Code Contributions

Here's how you can contribute code to the project:

1. Find an issue you want to work on or create one for new features
2. Assign yourself to the issue you're working on
3. Follow the [development workflow](#development-workflow) to create your changes
4. Write or update tests as needed
5. Ensure all tests pass and there are no linting errors
6. Submit a pull request referencing the issue

## Pull Request Process

1. Ensure your PR addresses a specific issue. If not, create an issue first.
2. Update the README.md or documentation with details of changes, if applicable.
3. Make sure your code follows the [style guides](#style-guides).
4. Include tests for new functionality and ensure all tests pass.
5. Update the CHANGELOG.md with details of changes if it's a significant feature.
6. The PR must receive approval from at least one project maintainer.
7. If your PR resolves an issue, include "Closes #issue-number" in the description.

## Style Guides

### Git Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- Use the format: `type(scope): subject`
- Types include: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Keep the subject line under 72 characters
- Use the imperative mood ("Add feature" not "Added feature")
- Reference issues in the body, not in the title

Examples:
```
feat(locations): add geolocation filter for waste disposal sites
fix(auth): resolve token refresh issue
docs(readme): update deployment instructions
```

### JavaScript Style Guide

We use ESLint with the Airbnb style guide. Here are some key principles:

- Use 2 spaces for indentation
- Use semicolons
- Prefer arrow functions
- Use template literals for string concatenation
- Use destructuring assignment
- Use `const` for variables that don't change, `let` for those that do
- Use async/await for asynchronous code

### Documentation Style Guide

- Use Markdown for all documentation
- Keep line length to 80-100 characters where possible
- Use code blocks with language syntax highlighting
- Include examples for API documentation
- Link to other relevant documentation when applicable

## Community

- Join our [Slack channel](#) for discussions
- Attend our monthly virtual meetups (see the [community calendar](#))
- Follow our [Twitter account](#) for updates

## Project Governance

### Project Team Structure

The UW Help App project is led by Bonaventure as the Project Lead, with contributions from the team:

- **Core Team**: Responsible for major architectural decisions and project direction
- **Contributors**: Community members who regularly contribute to the project
- **Ad-hoc Contributors**: Those who make occasional contributions

### Decision Making Process

- Minor changes can be approved by any Core Team member
- Major changes require consensus from the Core Team
- In case of disagreements, the Project Lead has the final say
- We strive for transparency in all decision-making

---

This document was last updated on April 16, 2025 by Bonaventure (PROYNSMD).