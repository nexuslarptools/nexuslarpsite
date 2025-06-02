import configJson from '../auth_config.json'
import { getConfig } from '../config'
import { getCsrfToken } from './csrf'
import { handleApiResponse, logError } from './errorHandler'
import { applyRateLimit } from './rateLimit'
import { sanitizeObject } from './inputValidation'

const {
    apiOrigin =
    configJson.APILocation
  } = getConfig()

/**
 * Make a POST request to the API with proper error handling and rate limiting
 * @param {Object} auth - Auth0 authentication object
 * @param {string} path - API endpoint path
 * @param {Object} bodystring - Request body
 * @returns {Promise<Object>} - Promise resolving to the API response
 */
export const apiPost = async (auth, path, bodystring) => {
  // Define the actual API request function
  const makeRequest = async () => {
    try {
      const token = await auth.getAccessTokenSilently();
      const csrfToken = getCsrfToken();

      // Sanitize the request body to prevent XSS and injection attacks
      const sanitizedBody = sanitizeObject(bodystring);

      const response = await fetch(apiOrigin + path, {
        method: 'post',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrfToken
        },
        body: JSON.stringify(sanitizedBody),
        credentials: 'include' // Include cookies in the request
      });

      return await handleApiResponse(response);
    } catch (error) {
      logError(error, `apiPost: ${path}`);
      throw error;
    }
  };

  // Apply rate limiting to the request function
  return applyRateLimit(makeRequest, path)();
}

export default apiPost
