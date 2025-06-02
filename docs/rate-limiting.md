# Rate Limiting Implementation

This document explains the rate limiting implementation in the Nexus LARP site.

## Overview

Rate limiting is a technique used to control the amount of incoming and outgoing traffic to or from a network, application, or service. The Nexus LARP site implements client-side rate limiting to prevent abuse of the API and provide a better user experience.

## Implementation Details

### 1. Rate Limiting Utility

The core of our rate limiting strategy is the utility in `src/utils/rateLimit.js`, which provides:

- **Request Tracking**: Tracks the number of requests made to each endpoint
- **Configurable Limits**: Allows different rate limits for different endpoints
- **Time-based Reset**: Automatically resets request counts after a configurable time window
- **User Feedback**: Provides information about when rate limits will reset

### 2. Default Configuration

The default rate limit configuration is:

```javascript
const defaultRateLimit = {
  maxRequests: 50,      // Maximum number of requests allowed
  windowMs: 60000,      // Time window in milliseconds (1 minute)
  message: 'Too many requests, please try again later.'
};
```

### 3. Endpoint-specific Configurations

Certain endpoints have specific rate limit configurations:

```javascript
const endpointRateLimits = {
  '/api/v1/Users': { maxRequests: 20, windowMs: 60000 },
  '/api/v1/Characters': { maxRequests: 30, windowMs: 60000 }
};
```

### 4. API Integration

All API utility functions (`apiGet.js`, `apiPost.js`, `apiPut.js`, `apiDelete.js`) have been updated to use the rate limiting utility:

```javascript
export const apiGet = async (auth, path) => {
  // Define the actual API request function
  const makeRequest = async () => {
    // ... API request code ...
  };

  // Apply rate limiting to the request function
  return applyRateLimit(makeRequest, path)();
};
```

### 5. Error Handling

When a rate limit is exceeded, the application:

1. Throws a 429 (Too Many Requests) error
2. Includes information about when the rate limit will reset
3. Displays a user-friendly error message with the time remaining until the rate limit resets

```javascript
if (rateLimitInfo.isLimited) {
  // Create a rate limit error
  const error = new Error(rateLimitInfo.message);
  error.status = 429; // Too Many Requests
  error.rateLimitInfo = rateLimitInfo;
  throw error;
}
```

## User Experience

When a user exceeds the rate limit for an endpoint, they will see a message like:

- "Rate limit exceeded. Please try again in 2 minutes."
- "Rate limit exceeded. Please try again in 45 seconds."
- "Rate limit exceeded. Please try again shortly."

This provides clear feedback about when they can try their request again.

## Technical Considerations

### Client-side vs. Server-side Rate Limiting

This implementation is a client-side rate limiting solution, which is different from server-side rate limiting:

- **Client-side rate limiting** prevents excessive requests from being sent from the client application
- **Server-side rate limiting** protects server resources by rejecting excessive requests at the server

For complete protection, both client-side and server-side rate limiting should be implemented. The server should still implement its own rate limiting as a defense-in-depth measure.

### Storage

The rate limiting state is stored in memory, which means:

1. Rate limits are reset when the page is refreshed
2. Each browser tab has its own rate limit counters
3. Rate limits do not persist across browser sessions

This is appropriate for a client-side implementation, as it prevents a single user from accidentally overwhelming the API while still allowing legitimate use across multiple sessions or devices.

## Testing

To test the rate limiting implementation:

1. Make repeated requests to the same endpoint in quick succession
2. Verify that after the rate limit is exceeded, a user-friendly error message is displayed
3. Wait for the rate limit window to pass and verify that requests work again

## References

- [OWASP API Security Top 10: API4:2023 - Unrestricted Resource Consumption](https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/)
- [MDN HTTP 429 Too Many Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429)