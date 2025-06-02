# Security Logging Implementation

This document explains the security logging implementation in the Nexus LARP site.

## Overview

Security logging is a critical component of a robust security strategy. The Nexus LARP site implements comprehensive security logging to:

1. Track security-relevant events
2. Detect potential security threats
3. Aid in forensic analysis after security incidents
4. Provide an audit trail for compliance purposes
5. Help identify patterns of suspicious activity

The security logging implementation ensures that sensitive information is not leaked in logs and provides different log levels for different types of security events.

## Security Logging Utility

The core of the security logging implementation is the `securityLogger.js` utility in the `src/utils` directory. This utility provides:

- Different security event types (authentication, authorization, input validation, etc.)
- Different severity levels (info, warning, error, critical)
- A main `logSecurityEvent` function that logs security events with proper sanitization
- Specialized functions for different types of security events

### Event Types

The following security event types are supported:

- `AUTHENTICATION`: Events related to user authentication (login, logout, etc.)
- `AUTHORIZATION`: Events related to user authorization (permission checks, role checks, etc.)
- `INPUT_VALIDATION`: Events related to input validation and sanitization
- `RATE_LIMITING`: Events related to API rate limiting
- `CSRF`: Events related to CSRF protection
- `API_SECURITY`: Events related to API security
- `DATA_ACCESS`: Events related to data access
- `GENERAL`: General security events

### Severity Levels

The following severity levels are supported:

- `INFO`: Informational events that don't indicate a security issue
- `WARNING`: Events that might indicate a security issue
- `ERROR`: Events that indicate a security issue
- `CRITICAL`: Events that indicate a critical security issue

## Security Logging in Different Components

### CSRF Protection

The CSRF protection utility (`src/utils/csrf.js`) logs security events when:

- CSRF tokens are generated
- CSRF tokens are validated
- CSRF validation fails (potential CSRF attack)

### Rate Limiting

The rate limiting utility (`src/utils/rateLimit.js`) logs security events when:

- Rate limits are initialized for an endpoint
- Rate limits are reset
- Rate limits are approached
- Rate limits are exceeded
- Rate-limited requests fail for other reasons

### Input Validation

The input validation utility (`src/utils/inputValidation.js`) logs security events when:

- Potentially malicious input is detected and sanitized
- Input validation fails
- Email validation fails
- URL validation fails (including detection of potentially dangerous protocols)
- Alphanumeric validation fails
- Required field validation fails
- Length validation fails

### Authentication and Authorization

The permissions checking utility (`src/utils/checkPermissions.js`) logs security events when:

- Permission checks pass or fail
- Role checks pass or fail
- Authentication is required but the user is not authenticated

## Best Practices for Security Logging

When working with the Nexus LARP codebase, follow these security logging best practices:

1. **Log security-relevant events**: Use the security logging utility to log events that are relevant to security
2. **Use the appropriate event type**: Choose the event type that best matches the event being logged
3. **Use the appropriate severity level**: Choose the severity level that best matches the severity of the event
4. **Include relevant context**: Include enough context to understand the event, but avoid including sensitive information
5. **Don't log sensitive information**: Never log passwords, tokens, or other sensitive information

## Monitoring and Alerting

In a production environment, security logs should be monitored and alerts should be set up for high-severity events. This can be done using a security information and event management (SIEM) system or a log monitoring service.

The security logging utility is designed to be easily integrated with such systems. In a production environment, the logs could be sent to a centralized logging service instead of being logged to the console.

## References

- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [NIST SP 800-92: Guide to Computer Security Log Management](https://csrc.nist.gov/publications/detail/sp/800-92/final)
- [SANS Logging and Monitoring](https://www.sans.org/security-resources/policies/general/pdf/logging-and-monitoring)