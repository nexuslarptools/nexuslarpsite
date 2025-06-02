import { v4 as uuidv4 } from 'uuid';
import { logCsrfEvent, SEVERITY_LEVELS } from './securityLogger';

/**
 * CSRF Protection Utility
 * 
 * This utility implements the Double Submit Cookie pattern for CSRF protection.
 * It generates a random token, stores it in both a cookie and localStorage,
 * and provides functions to retrieve and validate the token.
 */

// Cookie name for the CSRF token
const CSRF_COOKIE_NAME = 'XSRF-TOKEN';
// LocalStorage key for the CSRF token
const CSRF_STORAGE_KEY = 'xsrf-token';

/**
 * Generate a new CSRF token and store it in both a cookie and localStorage
 * @returns {string} The generated CSRF token
 */
export const generateCsrfToken = () => {
  // Generate a random token using UUID
  const token = uuidv4();

  // Store the token in localStorage
  localStorage.setItem(CSRF_STORAGE_KEY, token);

  // Store the token in a cookie
  // HttpOnly: false - So it can be read by JavaScript
  // SameSite: Strict - To prevent the cookie from being sent in cross-site requests
  // Secure: true - To only send the cookie over HTTPS
  document.cookie = `${CSRF_COOKIE_NAME}=${token}; SameSite=Strict; Secure; Path=/`;

  // Log the CSRF token generation event
  logCsrfEvent('CSRF token generated', SEVERITY_LEVELS.INFO, {
    tokenGenerated: true
  });

  return token;
};

/**
 * Get the current CSRF token from localStorage
 * If no token exists, generate a new one
 * @returns {string} The CSRF token
 */
export const getCsrfToken = () => {
  let token = localStorage.getItem(CSRF_STORAGE_KEY);

  // If no token exists, generate a new one
  if (!token) {
    token = generateCsrfToken();
  }

  return token;
};

/**
 * Check if the CSRF token in localStorage matches the one in the cookie
 * @returns {boolean} True if the tokens match, false otherwise
 */
export const validateCsrfToken = () => {
  const storageToken = localStorage.getItem(CSRF_STORAGE_KEY);
  if (!storageToken) {
    // Log the missing storage token event
    logCsrfEvent('CSRF validation failed: Missing storage token', SEVERITY_LEVELS.WARNING, {
      reason: 'missing_storage_token'
    });
    return false;
  }

  // Get the token from the cookie
  const cookies = document.cookie.split(';');
  const csrfCookie = cookies.find(cookie => cookie.trim().startsWith(`${CSRF_COOKIE_NAME}=`));

  if (!csrfCookie) {
    // Log the missing cookie token event
    logCsrfEvent('CSRF validation failed: Missing cookie token', SEVERITY_LEVELS.WARNING, {
      reason: 'missing_cookie_token'
    });
    return false;
  }

  const cookieToken = csrfCookie.split('=')[1].trim();

  // Compare the tokens
  const isValid = storageToken === cookieToken;

  if (isValid) {
    // Log successful validation
    logCsrfEvent('CSRF token validated successfully', SEVERITY_LEVELS.INFO, {
      validated: true
    });
  } else {
    // Log token mismatch - potential CSRF attack
    logCsrfEvent('CSRF validation failed: Token mismatch', SEVERITY_LEVELS.ERROR, {
      reason: 'token_mismatch'
    });
  }

  return isValid;
};

/**
 * Initialize CSRF protection by generating a token if one doesn't exist
 * This should be called when the application starts
 */
export const initCsrfProtection = () => {
  if (!localStorage.getItem(CSRF_STORAGE_KEY)) {
    generateCsrfToken();
    // Token generation is already logged in generateCsrfToken
  } else {
    // Log that CSRF protection is initialized with existing token
    logCsrfEvent('CSRF protection initialized with existing token', SEVERITY_LEVELS.INFO, {
      initialized: true,
      newToken: false
    });
  }
};

export default {
  generateCsrfToken,
  getCsrfToken,
  validateCsrfToken,
  initCsrfProtection
};
