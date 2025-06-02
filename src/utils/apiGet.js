import configJson from '../auth_config.json'
import { getConfig } from '../config'
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
 * Make a GET request to the API with proper error handling and rate limiting
 * @param {Object} auth - Auth0 authentication object
 * @param {string} path - API endpoint path
 * @returns {Promise<Object>} - Promise resolving to the API response
 */
export const apiGet = async (auth, path) => {
  // Define the actual API request function
  const makeRequest = async () => {
    try {
      const token = await auth.getAccessTokenSilently();
      // Sanitize the URL to prevent injection attacks
      const sanitizedUrl = sanitizeUrl(apiOrigin + path);

      const response = await fetch(sanitizedUrl, {
        headers: {Authorization: `Bearer ${token}`}
      });

      return await handleApiResponse(response);
    } catch (error) {
      logError(error, `apiGet: ${path}`);
      throw error;
    }
  };

  // Apply rate limiting to the request function
  return applyRateLimit(makeRequest, path)();
}

/**
 * Make a paginated GET request to the API with proper error handling and rate limiting
 * @param {Object} auth - Auth0 authentication object
 * @param {string} path - API endpoint path
 * @param {number} page - Page number
 * @param {number} numberPerPage - Number of items per page
 * @returns {Promise<Object>} - Promise resolving to the API response
 */
export const apiGetWithPage = async (auth, path, page, numberPerPage) => {
  // Define the actual API request function
  const makeRequest = async () => {
    try {
      const token = await auth.getAccessTokenSilently();
      // Construct the URL with pagination parameters
      const url = `${apiOrigin}${path}?pageNumber=${page}&_pageSize=${numberPerPage}`;

      // Sanitize the URL to prevent injection attacks
      const sanitizedUrl = sanitizeUrl(url);

      const response = await fetch(sanitizedUrl, {
        headers: {Authorization: `Bearer ${token}`}
      });

      return await handleApiResponse(response);
    } catch (error) {
      logError(error, `apiGetWithPage: ${path}`);
      throw error;
    }
  };

  // Apply rate limiting to the request function
  return applyRateLimit(makeRequest, path)();
}

export default apiGet
