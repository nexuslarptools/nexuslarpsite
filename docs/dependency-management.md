# Dependency Management and Vulnerability Scanning

This document explains the approach to dependency management and vulnerability scanning in the Nexus LARP site.

## Overview

Regular dependency updates and vulnerability scanning are critical for maintaining the security and stability of the application. The Nexus LARP site uses automated tools to:

1. Keep dependencies up to date
2. Scan for security vulnerabilities
3. Alert developers to security issues

## Automated Dependency Updates with Dependabot

The project uses GitHub's Dependabot to automatically check for dependency updates and create pull requests when updates are available.

### Configuration

Dependabot is configured in `.github/dependabot.yml` with the following settings:

- **Schedule**: Checks for updates weekly
- **Package Ecosystems**: npm
- **Pull Request Limit**: Maximum of 10 open pull requests at a time
- **Grouping**: Minor and patch updates are grouped together
- **Ignored Updates**: Major updates for React and React DOM are ignored to avoid breaking changes
- **Vulnerability Alerts**: Enabled for security vulnerabilities

### Workflow

1. Dependabot checks for updates weekly
2. If updates are available, Dependabot creates pull requests
3. Pull requests are labeled with "npm" and "dependencies"
4. Developers review and merge the pull requests

## Vulnerability Scanning with npm audit

The project uses npm audit to scan for security vulnerabilities in dependencies. This is automated through a GitHub Actions workflow.

### Configuration

The vulnerability scanning workflow is configured in `.github/workflows/security-scan.yml` with the following settings:

- **Schedule**: Runs weekly on Monday at 1:00 AM
- **Triggers**: Also runs on pushes and pull requests to main and development branches
- **Scope**: Scans production dependencies only
- **Alerts**: Creates GitHub issues for high and critical vulnerabilities

In addition, security checks are integrated into the CI/CD workflows:

- **Development Workflow** (`.github/workflows/dev.yml`): Runs security checks before building the Docker image
- **Release Workflow** (`.github/workflows/release.yml`): Runs security checks before building the release Docker image

### Workflow

1. The workflow runs npm audit to check for vulnerabilities
2. If high or critical vulnerabilities are found, a GitHub issue is created
3. The issue includes details about the vulnerabilities and recommended actions
4. Developers review the issues and update dependencies as needed

## Responding to Security Alerts

When a security alert is created, follow these steps:

1. **Review the Alert**: Understand the vulnerability and its impact
2. **Check for Updates**: Determine if an update is available that fixes the vulnerability
3. **Update Dependencies**: If an update is available, update the dependency
4. **Test the Update**: Ensure the update doesn't break the application
5. **Deploy the Update**: Deploy the updated dependency to production

## Manual Dependency Checks

In addition to automated checks, developers can manually check for vulnerabilities and updates:

### Check for Vulnerabilities

```bash
npm run security-check
```

This runs `npm audit --production` to check for vulnerabilities in production dependencies only.

### Check for Outdated Dependencies

```bash
npm run update-check
```

This runs `npm outdated` to show which dependencies are out of date and what versions are available.

### Update Dependencies

```bash
npm run update-deps
```

This runs `npm update` to update all dependencies to their latest compatible versions according to the version ranges specified in package.json.

## Best Practices

- **Review Pull Requests Promptly**: Dependabot pull requests should be reviewed and merged promptly
- **Prioritize Security Updates**: Security updates should be prioritized over feature updates
- **Test Updates Thoroughly**: All updates should be tested thoroughly before deployment
- **Keep Documentation Updated**: Update this document as the dependency management approach evolves
