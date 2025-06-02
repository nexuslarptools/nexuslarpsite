import configJson from '../auth_config.json'
import { getConfig } from '../config'
import { getCsrfToken } from './csrf'
import { handleApiResponse, logError } from './errorHandler'
import { applyRateLimit } from './rateLimit'
import { sanitizeString } from './inputValidation'

const {
    apiOrigin =
    configJson.APILocation
  } = getConfig()

/**
 * Sanitize URL parameters to prevent injection attacks
 * @param {string} url - The URL to sanitize
 * @returns {string} - The sanitized URL
 */
const sanitizeUrl = (url) => {
  // Split the URL into base and query string
  const [base, queryString] = url.split('?');

  // If there's no query string, return the base URL
  if (!queryString) {
    return base;
  }

  // Parse the query string into key-value pairs
  const params = new URLSearchParams(queryString);

  // Create a new URLSearchParams object for the sanitized parameters
  const sanitizedParams = new URLSearchParams();

  // Sanitize each parameter
  for (const [key, value] of params.entries()) {
    sanitizedParams.append(sanitizeString(key), sanitizeString(value));
  }

  // Reconstruct the URL with sanitized parameters
  return `${base}?${sanitizedParams.toString()}`;
}

/**
 * Make a DELETE request to the API with proper error handling and rate limiting
 * @param {Object} auth - Auth0 authentication object
 * @param {string} path - API endpoint path
 * @returns {Promise<Object>} - Promise resolving to the API response
 */
export const apiDelete = async (auth, path) => {
  // Define the actual API request function
  const makeRequest = async () => {
    try {
      const token = await auth.getAccessTokenSilently();
      const csrfToken = getCsrfToken();

      // Sanitize the URL to prevent injection attacks
      const sanitizedUrl = sanitizeUrl(apiOrigin + path);

      const response = await fetch(sanitizedUrl, {
        method: 'delete',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrfToken
        },
        credentials: 'include' // Include cookies in the request
      });

      return await handleApiResponse(response);
    } catch (error) {
      logError(error, `apiDelete: ${path}`);
      throw error;
    }
  };

  // Apply rate limiting to the request function
  return applyRateLimit(makeRequest, path)();
}

export default apiDelete
