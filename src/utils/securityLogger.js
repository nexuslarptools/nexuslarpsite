/**
 * Security Logger Utility
 * 
 * This utility provides centralized security event logging for the application.
 * It ensures that sensitive information is not leaked in logs and provides
 * different log levels for different types of security events.
 */

import { sanitizeError } from './errorHandler';

// Security event types
export const SECURITY_EVENT_TYPES = {
  AUTHENTICATION: 'AUTHENTICATION',
  AUTHORIZATION: 'AUTHORIZATION',
  INPUT_VALIDATION: 'INPUT_VALIDATION',
  RATE_LIMITING: 'RATE_LIMITING',
  CSRF: 'CSRF',
  API_SECURITY: 'API_SECURITY',
  DATA_ACCESS: 'DATA_ACCESS',
  GENERAL: 'GENERAL'
};

// Security event severity levels
export const SEVERITY_LEVELS = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  CRITICAL: 'CRITICAL'
};

/**
 * Log a security event
 * @param {string} eventType - Type of security event (use SECURITY_EVENT_TYPES)
 * @param {string} message - Description of the security event
 * @param {string} severity - Severity level (use SEVERITY_LEVELS)
 * @param {Object} details - Additional details about the event (will be sanitized)
 * @param {string} userId - ID of the user associated with the event (if applicable)
 */
export const logSecurityEvent = (eventType, message, severity = SEVERITY_LEVELS.INFO, details = {}, userId = null) => {
  // Create a security event object
  const securityEvent = {
    timestamp: new Date().toISOString(),
    eventType,
    message,
    severity,
    userId
  };

  // Sanitize details to remove sensitive information
  if (details instanceof Error) {
    securityEvent.details = sanitizeError(details);
  } else if (typeof details === 'object' && details !== null) {
    // Remove sensitive fields from details
    const sanitizedDetails = { ...details };
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'credential', 'authorization'];
    
    for (const field of sensitiveFields) {
      if (field in sanitizedDetails) {
        sanitizedDetails[field] = '[REDACTED]';
      }
    }
    
    securityEvent.details = sanitizedDetails;
  }

  // In development, we can log more details
  if (process.env.NODE_ENV === 'development') {
    console.log(`[SECURITY ${severity}] ${eventType}: ${message}`, securityEvent);
  } else {
    // In production, log minimal information and potentially send to a security monitoring service
    console.log(`[SECURITY ${severity}] ${eventType}: ${message} (User: ${userId || 'anonymous'})`);
    
    // Here you would typically send the security event to a monitoring service
    // Example: sendToSecurityMonitoring(securityEvent);
  }

  return securityEvent;
};

/**
 * Log an authentication event
 * @param {string} message - Description of the authentication event
 * @param {string} severity - Severity level
 * @param {Object} details - Additional details
 * @param {string} userId - User ID
 */
export const logAuthenticationEvent = (message, severity = SEVERITY_LEVELS.INFO, details = {}, userId = null) => {
  return logSecurityEvent(SECURITY_EVENT_TYPES.AUTHENTICATION, message, severity, details, userId);
};

/**
 * Log an authorization event
 * @param {string} message - Description of the authorization event
 * @param {string} severity - Severity level
 * @param {Object} details - Additional details
 * @param {string} userId - User ID
 */
export const logAuthorizationEvent = (message, severity = SEVERITY_LEVELS.INFO, details = {}, userId = null) => {
  return logSecurityEvent(SECURITY_EVENT_TYPES.AUTHORIZATION, message, severity, details, userId);
};

/**
 * Log an input validation event
 * @param {string} message - Description of the input validation event
 * @param {string} severity - Severity level
 * @param {Object} details - Additional details
 * @param {string} userId - User ID
 */
export const logInputValidationEvent = (message, severity = SEVERITY_LEVELS.INFO, details = {}, userId = null) => {
  return logSecurityEvent(SECURITY_EVENT_TYPES.INPUT_VALIDATION, message, severity, details, userId);
};

/**
 * Log a rate limiting event
 * @param {string} message - Description of the rate limiting event
 * @param {string} severity - Severity level
 * @param {Object} details - Additional details
 * @param {string} userId - User ID
 */
export const logRateLimitingEvent = (message, severity = SEVERITY_LEVELS.INFO, details = {}, userId = null) => {
  return logSecurityEvent(SECURITY_EVENT_TYPES.RATE_LIMITING, message, severity, details, userId);
};

/**
 * Log a CSRF event
 * @param {string} message - Description of the CSRF event
 * @param {string} severity - Severity level
 * @param {Object} details - Additional details
 * @param {string} userId - User ID
 */
export const logCsrfEvent = (message, severity = SEVERITY_LEVELS.INFO, details = {}, userId = null) => {
  return logSecurityEvent(SECURITY_EVENT_TYPES.CSRF, message, severity, details, userId);
};

/**
 * Log an API security event
 * @param {string} message - Description of the API security event
 * @param {string} severity - Severity level
 * @param {Object} details - Additional details
 * @param {string} userId - User ID
 */
export const logApiSecurityEvent = (message, severity = SEVERITY_LEVELS.INFO, details = {}, userId = null) => {
  return logSecurityEvent(SECURITY_EVENT_TYPES.API_SECURITY, message, severity, details, userId);
};

/**
 * Log a data access event
 * @param {string} message - Description of the data access event
 * @param {string} severity - Severity level
 * @param {Object} details - Additional details
 * @param {string} userId - User ID
 */
export const logDataAccessEvent = (message, severity = SEVERITY_LEVELS.INFO, details = {}, userId = null) => {
  return logSecurityEvent(SECURITY_EVENT_TYPES.DATA_ACCESS, message, severity, details, userId);
};

export default {
  logSecurityEvent,
  logAuthenticationEvent,
  logAuthorizationEvent,
  logInputValidationEvent,
  logRateLimitingEvent,
  logCsrfEvent,
  logApiSecurityEvent,
  logDataAccessEvent,
  SECURITY_EVENT_TYPES,
  SEVERITY_LEVELS
};