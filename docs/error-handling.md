# Error Handling Implementation

This document explains the error handling implementation in the Nexus LARP site, focusing on preventing information leakage and providing a better user experience.

## Overview

Proper error handling is crucial for both security and user experience. The Nexus LARP site implements a comprehensive error handling strategy that:

1. Prevents sensitive information from being leaked in error messages
2. Provides user-friendly error messages
3. Logs errors safely for debugging
4. Catches and handles unexpected errors gracefully

## Implementation Details

### 1. Centralized Error Handling Utility

The core of our error handling strategy is the centralized error handling utility in `src/utils/errorHandler.js`, which provides:

- **Error Sanitization**: Removes sensitive information from error objects
- **Safe Error Logging**: Logs errors with different levels of detail based on the environment
- **User-Friendly Error Messages**: Converts technical errors into messages that users can understand
- **Consistent API Error Handling**: Standardizes how API responses are processed

### 2. API Error Handling

All API utility functions (`apiGet.js`, `apiPost.js`, `apiPut.js`, `apiDelete.js`) have been updated to:

- Use try/catch blocks to catch and handle errors
- Use the `handleApiResponse` function to process API responses consistently
- Log errors safely using the `logError` function
- Throw sanitized errors that don't contain sensitive information

Example:
```javascript
export const apiGet = async (auth, path) => {
  try {
    const token = await auth.getAccessTokenSilently();
    const response = await fetch(apiOrigin + path, {
      headers: {Authorization: `Bearer ${token}`}
    });
    
    return await handleApiResponse(response);
  } catch (error) {
    logError(error, `apiGet: ${path}`);
    throw error;
  }
}
```

### 3. React Query Mutations

Data utility functions (`deletedata.js`, `postdata.js`, `putdata.js`) have been updated to:

- Use the centralized error handling utility
- Provide user-friendly error messages through callbacks
- Log errors safely

Example:
```javascript
export const usePostData = (path, relatedQs, onErrorCallback) => {
  // ...
  return useMutation({
    // ...
    onError: (error) => {
      logError(error, `usePostData: ${path}`);
      
      if (onErrorCallback && typeof onErrorCallback === 'function') {
        onErrorCallback(getUserFriendlyErrorMessage(error));
      }
    }
  });
}
```

### 4. React Error Boundaries

A React Error Boundary component (`ErrorBoundary.jsx`) has been implemented to:

- Catch JavaScript errors in child components
- Display a fallback UI instead of crashing the app
- Log errors safely using the centralized error handling utility

Example usage:
```jsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### 5. Environment-Specific Logging

Error logging is environment-specific:

- In development: More detailed error information is logged to help with debugging
- In production: Minimal information is logged to prevent information leakage

Example:
```javascript
if (process.env.NODE_ENV === 'development') {
  console.error(`Error in ${context}:`, sanitized);
} else {
  console.error(`Error in ${context}: ${sanitized.message}`);
}
```

### 6. User-Friendly Error Messages

The `getUserFriendlyErrorMessage` function converts technical errors into messages that users can understand:

- HTTP status codes are mapped to user-friendly messages
- Network errors have specific messages
- Default messages are provided for unexpected errors

## Best Practices

When working with the Nexus LARP codebase, follow these error handling best practices:

1. **Never log raw error objects**: Always use the `logError` function
2. **Use try/catch blocks**: Wrap code that might throw errors in try/catch blocks
3. **Provide user feedback**: Show user-friendly error messages when operations fail
4. **Use Error Boundaries**: Wrap components in Error Boundaries to prevent the entire app from crashing
5. **Don't expose sensitive information**: Never include sensitive information in error messages or logs

## Testing Error Handling

To test the error handling implementation:

1. Simulate API errors by disconnecting from the network
2. Check that user-friendly error messages are displayed
3. Verify that no sensitive information is logged to the console
4. Intentionally throw errors in components to test Error Boundaries

## References

- [React Error Boundaries Documentation](https://reactjs.org/docs/error-boundaries.html)
- [OWASP Information Leakage](https://owasp.org/www-community/Improper_Error_Handling)
- [React Query Error Handling](https://tanstack.com/query/latest/docs/react/guides/error-handling)