/**
 * Error Handler Utility
 * 
 * This utility provides centralized error handling functions for the application.
 * It ensures that sensitive information is not leaked in error messages or logs.
 */

/**
 * Sanitize an error object to remove sensitive information
 * @param {Error|Object|string} error - The error to sanitize
 * @returns {Object} A sanitized error object safe for logging or displaying
 */
export const sanitizeError = (error) => {
  // If error is undefined or null, return a generic error
  if (!error) {
    return { message: 'An unknown error occurred', type: 'unknown' };
  }

  // If error is a string, return it as a message
  if (typeof error === 'string') {
    return { message: error, type: 'string' };
  }

  // Create a sanitized error object
  const sanitized = {
    message: error.message || 'An error occurred',
    type: error.name || 'Error',
    code: error.code || error.status || error.statusCode,
  };

  // Add stack trace in development mode only
  if (process.env.NODE_ENV === 'development' && error.stack) {
    sanitized.stack = error.stack;
  }

  return sanitized;
};

/**
 * Log an error to the console in a safe manner
 * @param {Error|Object|string} error - The error to log
 * @param {string} context - The context where the error occurred (e.g., 'apiGet', 'UserComponent')
 */
export const logError = (error, context = '') => {
  const sanitized = sanitizeError(error);

  // In development, we can log more details
  if (process.env.NODE_ENV === 'development') {
    console.error(`Error in ${context}:`, sanitized);
  } else {
    // In production, log minimal information
    console.error(`Error in ${context}: ${sanitized.message}`);
  }
};

/**
 * Handle API errors consistently
 * @param {Response} response - The fetch response object
 * @returns {Promise} A promise that resolves to the JSON response or rejects with a sanitized error
 */
export const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || `API error: ${response.status}`);
    error.status = response.status;
    error.statusText = response.statusText;
    error.code = errorData.code;
    throw error;
  }

  return response.json();
};

/**
 * Create a user-friendly error message
 * @param {Error|Object|string} error - The error to create a message from
 * @returns {string} A user-friendly error message
 */
export const getUserFriendlyErrorMessage = (error) => {
  const sanitized = sanitizeError(error);

  // Map HTTP status codes to user-friendly messages
  if (sanitized.code) {
    switch (sanitized.code) {
      case 400:
        return 'The request was invalid. Please check your input and try again.';
      case 401:
        return 'You are not authenticated. Please log in and try again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 429:
        // Handle rate limit errors with more specific information
        if (error.rateLimitInfo) {
          const { remainingMs } = error.rateLimitInfo;
          const seconds = Math.ceil(remainingMs / 1000);
          const minutes = Math.ceil(seconds / 60);

          if (minutes > 1) {
            return `Rate limit exceeded. Please try again in ${minutes} minutes.`;
          } else if (seconds > 1) {
            return `Rate limit exceeded. Please try again in ${seconds} seconds.`;
          } else {
            return 'Rate limit exceeded. Please try again shortly.';
          }
        }
        return 'Too many requests. Please try again later.';
      case 500:
        return 'An internal server error occurred. Please try again later.';
      default:
        if (sanitized.code >= 400 && sanitized.code < 500) {
          return 'There was a problem with your request. Please try again.';
        } else if (sanitized.code >= 500) {
          return 'A server error occurred. Please try again later.';
        }
    }
  }

  // For network errors
  if (sanitized.type === 'NetworkError' || sanitized.message.includes('network')) {
    return 'A network error occurred. Please check your connection and try again.';
  }

  // Default message
  return 'An unexpected error occurred. Please try again.';
};

export default {
  sanitizeError,
  logError,
  handleApiResponse,
  getUserFriendlyErrorMessage
};
