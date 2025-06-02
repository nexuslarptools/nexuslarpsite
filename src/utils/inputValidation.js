/**
 * Input Validation and Sanitization Utility
 * 
 * This utility provides functions for validating and sanitizing user input
 * to prevent security issues like XSS, SQL injection, and other input-based attacks.
 */

import DOMPurify from 'dompurify';
import { logInputValidationEvent, SEVERITY_LEVELS } from './securityLogger';

/**
 * Sanitize a string to prevent XSS attacks
 * @param {string} input - The string to sanitize
 * @returns {string} - The sanitized string
 */
export const sanitizeString = (input) => {
  if (input === null || input === undefined) {
    return '';
  }

  if (typeof input !== 'string') {
    input = String(input);
  }

  // Check for potentially malicious content before sanitizing
  const originalInput = input;

  // Use DOMPurify to sanitize HTML
  const sanitized = DOMPurify.sanitize(input, { ALLOWED_TAGS: [] }).trim();

  // If the sanitized string is different from the original, it might have contained malicious content
  if (sanitized !== originalInput) {
    // Check for common XSS patterns
    const xssPatterns = [
      '<script', 'javascript:', 'onerror=', 'onclick=', 'onload=', 'onmouseover=',
      'eval(', 'document.cookie', 'alert(', '<iframe', '<img src=x onerror'
    ];

    const foundPatterns = xssPatterns.filter(pattern => 
      originalInput.toLowerCase().includes(pattern.toLowerCase())
    );

    if (foundPatterns.length > 0) {
      // Log potential XSS attack with high severity
      logInputValidationEvent('Potential XSS attack detected', SEVERITY_LEVELS.ERROR, {
        patternsFound: foundPatterns,
        inputLength: originalInput.length,
        sanitizedLength: sanitized.length
      });
    } else {
      // Log suspicious input with medium severity
      logInputValidationEvent('Suspicious input sanitized', SEVERITY_LEVELS.WARNING, {
        inputLength: originalInput.length,
        sanitizedLength: sanitized.length,
        difference: originalInput.length - sanitized.length
      });
    }
  }

  return sanitized;
};

/**
 * Sanitize an object by sanitizing all string properties
 * @param {Object} obj - The object to sanitize
 * @returns {Object} - The sanitized object
 */
export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const sanitized = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value);
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map(item => 
          typeof item === 'object' ? sanitizeObject(item) : 
          typeof item === 'string' ? sanitizeString(item) : item
        );
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
  }

  return sanitized;
};

/**
 * Validate an email address
 * @param {string} email - The email to validate
 * @returns {boolean} - True if the email is valid, false otherwise
 */
export const validateEmail = (email, fieldName = 'email') => {
  if (!email) {
    logInputValidationEvent('Email validation failed: empty input', SEVERITY_LEVELS.INFO, {
      fieldName,
      reason: 'empty_input'
    });
    return false;
  }

  // RFC 5322 compliant email regex
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const isValid = emailRegex.test(String(email).toLowerCase());

  if (!isValid) {
    logInputValidationEvent('Email validation failed: invalid format', SEVERITY_LEVELS.WARNING, {
      fieldName,
      reason: 'invalid_format',
      inputLength: String(email).length
    });
  }

  return isValid;
};

/**
 * Validate a URL
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if the URL is valid, false otherwise
 */
export const validateUrl = (url, fieldName = 'url') => {
  if (!url) {
    logInputValidationEvent('URL validation failed: empty input', SEVERITY_LEVELS.INFO, {
      fieldName,
      reason: 'empty_input'
    });
    return false;
  }

  try {
    new URL(url);

    // Additional security checks for URLs
    const urlObj = new URL(url);
    const protocol = urlObj.protocol.toLowerCase();

    // Check for potentially dangerous protocols
    if (protocol !== 'http:' && protocol !== 'https:') {
      logInputValidationEvent('URL validation failed: potentially dangerous protocol', SEVERITY_LEVELS.ERROR, {
        fieldName,
        protocol,
        reason: 'dangerous_protocol'
      });
      return false;
    }

    return true;
  } catch (e) {
    logInputValidationEvent('URL validation failed: invalid format', SEVERITY_LEVELS.WARNING, {
      fieldName,
      reason: 'invalid_format',
      inputLength: String(url).length,
      errorMessage: e.message
    });
    return false;
  }
};

/**
 * Validate that a string contains only alphanumeric characters, spaces, and common punctuation
 * @param {string} input - The string to validate
 * @returns {boolean} - True if the string is valid, false otherwise
 */
export const validateAlphanumeric = (input, fieldName = 'field') => {
  if (!input) {
    logInputValidationEvent('Alphanumeric validation failed: empty input', SEVERITY_LEVELS.INFO, {
      fieldName,
      reason: 'empty_input'
    });
    return false;
  }

  const alphanumericRegex = /^[a-zA-Z0-9 .,!?;:'"()-]*$/;
  const isValid = alphanumericRegex.test(input);

  if (!isValid) {
    // Find the invalid characters for logging
    const invalidChars = [];
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      if (!char.match(/[a-zA-Z0-9 .,!?;:'"()-]/)) {
        invalidChars.push(char);
      }
    }

    logInputValidationEvent('Alphanumeric validation failed: invalid characters', SEVERITY_LEVELS.WARNING, {
      fieldName,
      reason: 'invalid_characters',
      invalidChars: invalidChars.slice(0, 10), // Limit to first 10 invalid chars
      invalidCharCount: invalidChars.length
    });
  }

  return isValid;
};

/**
 * Validate that a string is not empty
 * @param {string} input - The string to validate
 * @returns {boolean} - True if the string is not empty, false otherwise
 */
export const validateRequired = (input, fieldName = 'field') => {
  const isValid = input !== null && input !== undefined && String(input).trim() !== '';

  if (!isValid) {
    logInputValidationEvent('Required field validation failed', SEVERITY_LEVELS.INFO, {
      fieldName,
      reason: 'empty_required_field',
      inputType: input === null ? 'null' : input === undefined ? 'undefined' : 'empty_string'
    });
  }

  return isValid;
};

/**
 * Validate that a string is within a certain length
 * @param {string} input - The string to validate
 * @param {number} minLength - The minimum length
 * @param {number} maxLength - The maximum length
 * @returns {boolean} - True if the string is within the length constraints, false otherwise
 */
export const validateLength = (input, minLength, maxLength, fieldName = 'field') => {
  if (input === null || input === undefined) {
    logInputValidationEvent('Length validation failed: null or undefined input', SEVERITY_LEVELS.INFO, {
      fieldName,
      reason: 'null_or_undefined',
      minLength,
      maxLength
    });
    return false;
  }

  const length = String(input).length;
  const isValid = length >= minLength && length <= maxLength;

  if (!isValid) {
    // Determine if the input is too short or too long
    const reason = length < minLength ? 'too_short' : 'too_long';
    const severity = reason === 'too_long' ? SEVERITY_LEVELS.WARNING : SEVERITY_LEVELS.INFO;

    logInputValidationEvent(`Length validation failed: ${reason}`, severity, {
      fieldName,
      reason,
      actualLength: length,
      minLength,
      maxLength,
      difference: reason === 'too_short' ? minLength - length : length - maxLength
    });
  }

  return isValid;
};

/**
 * Create validation rules for react-hook-form
 * @param {Object} rules - The validation rules
 * @returns {Object} - The validation rules for react-hook-form
 */
export const createValidationRules = (rules) => {
  const validationRules = {};

  if (rules.required) {
    validationRules.required = {
      value: true,
      message: rules.requiredMessage || 'This field is required'
    };
  }

  if (rules.minLength) {
    validationRules.minLength = {
      value: rules.minLength,
      message: rules.minLengthMessage || `Minimum length is ${rules.minLength} characters`
    };
  }

  if (rules.maxLength) {
    validationRules.maxLength = {
      value: rules.maxLength,
      message: rules.maxLengthMessage || `Maximum length is ${rules.maxLength} characters`
    };
  }

  if (rules.pattern) {
    validationRules.pattern = {
      value: rules.pattern,
      message: rules.patternMessage || 'Invalid format'
    };
  }

  if (rules.validate) {
    validationRules.validate = rules.validate;
  }

  return validationRules;
};

export default {
  sanitizeString,
  sanitizeObject,
  validateEmail,
  validateUrl,
  validateAlphanumeric,
  validateRequired,
  validateLength,
  createValidationRules
};
