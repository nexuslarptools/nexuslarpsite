# CSRF Protection Implementation

This document explains the Cross-Site Request Forgery (CSRF) protection implementation in the Nexus LARP site.

## Overview

CSRF is an attack that forces authenticated users to execute unwanted actions on a web application in which they're currently authenticated. The Nexus LARP site implements CSRF protection using the Double Submit Cookie pattern, which is a common and effective approach for Single Page Applications (SPAs).

## Implementation Details

### 1. CSRF Token Generation and Validation

The CSRF protection is implemented in the `src/utils/csrf.js` file, which provides the following functions:

- `generateCsrfToken()`: Generates a new CSRF token using UUID and stores it in both a cookie and localStorage
- `getCsrfToken()`: Retrieves the current CSRF token from localStorage, or generates a new one if none exists
- `validateCsrfToken()`: Validates that the token in localStorage matches the one in the cookie
- `initCsrfProtection()`: Initializes CSRF protection by generating a token if one doesn't exist

The token is stored in both a cookie and localStorage to implement the Double Submit Cookie pattern:
- The cookie is sent automatically with each request to the server
- The token from localStorage is sent in a custom header with each request
- The server can validate that the token in the header matches the one in the cookie

### 2. API Request Protection

All non-GET API requests (POST, PUT, DELETE) include the CSRF token in the `X-XSRF-TOKEN` header:

- `apiPost.js`: Includes the CSRF token in POST requests
- `apiPut.js`: Includes the CSRF token in PUT requests
- `apiDelete.js`: Includes the CSRF token in DELETE requests

Each API request also includes the `credentials: 'include'` option to ensure that cookies are sent with the request.

### 3. Auth0 CSRF Protection

Auth0 has built-in CSRF protection for authentication flows. The Auth0 provider is configured with the following options to enhance CSRF protection:

- `useCookiesForTransactions: true`: Enables the use of cookies for Auth0 transactions
- `cookieDomain: window.location.hostname`: Sets the domain for the cookies
- `cookieSameSite: 'strict'`: Sets the SameSite attribute of the cookies to 'strict'

## Testing CSRF Protection

To verify that CSRF protection is working correctly:

1. Open the browser's developer tools
2. Go to the Application tab
3. Check that a cookie named `XSRF-TOKEN` exists
4. Check that the same token exists in localStorage under the key `xsrf-token`
5. Make a POST, PUT, or DELETE request in the application
6. In the Network tab, verify that the request includes the `X-XSRF-TOKEN` header with the token value

## Server-Side Implementation

For complete CSRF protection, the server must also validate the CSRF token. The server should:

1. Extract the token from the `X-XSRF-TOKEN` header
2. Extract the token from the `XSRF-TOKEN` cookie
3. Compare the two tokens and reject the request if they don't match

## Security Considerations

- The CSRF token is regenerated when the application starts
- The cookie has the `SameSite=Strict` attribute to prevent it from being sent in cross-site requests
- The cookie has the `Secure` attribute to ensure it's only sent over HTTPS
- The token is a random UUID, making it difficult to guess

## References

- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Auth0 Documentation on CSRF Protection](https://auth0.com/docs/secure/attack-protection/csrf)
- [Double Submit Cookie Pattern](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#double-submit-cookie)