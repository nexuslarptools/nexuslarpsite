/**
 * Rate Limiting Utility
 * 
 * This utility implements rate limiting for API requests to prevent abuse.
 * It tracks the number of requests made to each endpoint and enforces rate limits
 * based on configurable rules.
 */

import { logRateLimitingEvent, SEVERITY_LEVELS } from './securityLogger';

// Store for tracking request counts and timestamps
const requestStore = {
  // Format: { [endpoint]: { count: number, resetTime: number } }
};

// Default rate limit configuration
const defaultRateLimit = {
  maxRequests: 50,      // Maximum number of requests allowed
  windowMs: 60000,      // Time window in milliseconds (1 minute)
  message: 'Too many requests, please try again later.'
};

// Endpoint-specific rate limit configurations
const endpointRateLimits = {
  // Examples:
  '/api/v1/Users': { maxRequests: 20, windowMs: 60000 },
  '/api/v1/Characters': { maxRequests: 30, windowMs: 60000 }
  // Add more endpoint-specific configurations as needed
};

/**
 * Get the rate limit configuration for a specific endpoint
 * @param {string} endpoint - The API endpoint
 * @returns {Object} - The rate limit configuration for the endpoint
 */
export const getRateLimitConfig = (endpoint) => {
  // Check if there's a specific configuration for this endpoint
  for (const pattern in endpointRateLimits) {
    if (endpoint.startsWith(pattern)) {
      return { ...defaultRateLimit, ...endpointRateLimits[pattern] };
    }
  }

  // Return default configuration if no specific configuration exists
  return defaultRateLimit;
};

/**
 * Check if a request should be rate limited
 * @param {string} endpoint - The API endpoint
 * @returns {Object} - Object with isLimited flag and reset time
 */
export const checkRateLimit = (endpoint) => {
  const now = Date.now();
  const config = getRateLimitConfig(endpoint);

  // Initialize endpoint in the store if it doesn't exist
  if (!requestStore[endpoint]) {
    requestStore[endpoint] = {
      count: 0,
      resetTime: now + config.windowMs
    };

    // Log initialization of rate limiting for this endpoint
    logRateLimitingEvent('Rate limiting initialized for endpoint', SEVERITY_LEVELS.INFO, {
      endpoint,
      maxRequests: config.maxRequests,
      windowMs: config.windowMs
    });
  }

  // Reset count if the time window has passed
  if (now > requestStore[endpoint].resetTime) {
    // Log reset of rate limit counter
    logRateLimitingEvent('Rate limit counter reset', SEVERITY_LEVELS.INFO, {
      endpoint,
      previousCount: requestStore[endpoint].count
    });

    requestStore[endpoint] = {
      count: 0,
      resetTime: now + config.windowMs
    };
  }

  // Increment the request count
  requestStore[endpoint].count++;
  const currentCount = requestStore[endpoint].count;

  // Check if the request count exceeds the limit
  const isLimited = currentCount > config.maxRequests;

  // Calculate remaining time until reset
  const resetTime = requestStore[endpoint].resetTime;
  const remainingMs = Math.max(0, resetTime - now);
  const remainingRequests = Math.max(0, config.maxRequests - currentCount);

  // Log rate limit check
  if (isLimited) {
    // Log rate limit exceeded with WARNING level
    logRateLimitingEvent('Rate limit exceeded', SEVERITY_LEVELS.WARNING, {
      endpoint,
      currentCount,
      maxRequests: config.maxRequests,
      remainingMs,
      resetTime: new Date(resetTime).toISOString()
    });
  } else if (remainingRequests < 5) {
    // Log approaching rate limit with INFO level
    logRateLimitingEvent('Approaching rate limit', SEVERITY_LEVELS.INFO, {
      endpoint,
      currentCount,
      maxRequests: config.maxRequests,
      remainingRequests,
      remainingMs
    });
  }

  return {
    isLimited,
    resetTime,
    remainingMs,
    message: config.message,
    remainingRequests
  };
};

/**
 * Apply rate limiting to a function
 * @param {Function} fn - The function to apply rate limiting to
 * @param {string} endpoint - The API endpoint
 * @returns {Function} - The rate-limited function
 */
export const applyRateLimit = (fn, endpoint) => {
  return async (...args) => {
    const rateLimitInfo = checkRateLimit(endpoint);

    if (rateLimitInfo.isLimited) {
      // Create a rate limit error
      const error = new Error(rateLimitInfo.message);
      error.status = 429; // Too Many Requests
      error.rateLimitInfo = rateLimitInfo;

      // Log rate limit enforcement with ERROR level
      logRateLimitingEvent('Rate limit enforced - request blocked', SEVERITY_LEVELS.ERROR, {
        endpoint,
        status: 429,
        remainingMs: rateLimitInfo.remainingMs,
        resetTime: new Date(rateLimitInfo.resetTime).toISOString()
      });

      throw error;
    }

    // If not rate limited, call the original function
    try {
      const result = await fn(...args);

      // Log successful request (only if we're close to the limit to avoid excessive logging)
      if (rateLimitInfo.remainingRequests < 10) {
        logRateLimitingEvent('Request allowed under rate limit', SEVERITY_LEVELS.INFO, {
          endpoint,
          remainingRequests: rateLimitInfo.remainingRequests
        });
      }

      return result;
    } catch (error) {
      // If the request fails for other reasons, still log it for rate limiting context
      logRateLimitingEvent('Rate-limited request failed for other reasons', SEVERITY_LEVELS.WARNING, {
        endpoint,
        errorStatus: error.status || 'unknown',
        errorMessage: error.message
      });

      throw error;
    }
  };
};

export default {
  checkRateLimit,
  applyRateLimit,
  getRateLimitConfig
};
