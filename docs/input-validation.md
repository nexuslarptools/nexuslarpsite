# Input Validation and Sanitization Implementation

This document explains the input validation and sanitization implementation in the Nexus LARP site.

## Overview

Input validation and sanitization are crucial for security and user experience. The Nexus LARP site implements a comprehensive validation and sanitization strategy that:

1. Validates user input to ensure it meets requirements
2. Sanitizes user input to prevent XSS and other injection attacks
3. Provides user-friendly error messages for validation errors
4. Applies validation and sanitization consistently across the application

## Implementation Details

### 1. Centralized Validation and Sanitization Utility

The core of our validation and sanitization strategy is the centralized utility in `src/utils/inputValidation.js`, which provides:

- **String Sanitization**: Removes potentially malicious content from strings
- **Object Sanitization**: Recursively sanitizes all string properties in objects
- **Email Validation**: Validates email addresses against RFC 5322
- **URL Validation**: Validates URLs
- **Alphanumeric Validation**: Validates that strings contain only allowed characters
- **Length Validation**: Validates that strings are within length constraints
- **Required Field Validation**: Validates that fields are not empty
- **React Hook Form Integration**: Creates validation rules for react-hook-form

### 2. API Request Sanitization

All API utility functions have been updated to sanitize input:

- **apiPost.js**: Sanitizes the request body before sending it to the server
- **apiPut.js**: Sanitizes the request body before sending it to the server
- **apiGet.js**: Sanitizes URL parameters to prevent injection attacks
- **apiDelete.js**: Sanitizes URL parameters to prevent injection attacks

Example:
```javascript
// Sanitize the request body to prevent XSS and injection attacks
const sanitizedBody = sanitizeObject(bodystring);

const response = await fetch(apiOrigin + path, {
  method: 'post',
  headers: { /* ... */ },
  body: JSON.stringify(sanitizedBody),
  credentials: 'include'
});
```

### 3. Form Validation and Sanitization

Form components use the validation utility to validate and sanitize user input:

- **EmailHelp.jsx**: Uses createValidationRules for form validation and sanitizeObject for form data

Example:
```javascript
// Validation rules for react-hook-form
<Input 
  type="text" 
  id="subject"  
  {...register('subject', createValidationRules({
    required: true,
    requiredMessage: 'Subject is required',
    minLength: 3,
    maxLength: 100
  }))} 
  onChange={(e) => updateValue(e)}
  error={!!errors.subject}
/>
{errors.subject && (
  <FormHelperText error>{errors.subject.message}</FormHelperText>
)}

// Sanitize form data before submission
const sanitizedData = sanitizeObject(formData);
```

## Using the Validation Utility

### 1. Validating Input

```javascript
import { validateEmail, validateUrl, validateAlphanumeric, validateRequired, validateLength } from '../utils/inputValidation';

// Validate an email address
const isValidEmail = validateEmail('user@example.com'); // true

// Validate a URL
const isValidUrl = validateUrl('https://example.com'); // true

// Validate alphanumeric input
const isValidText = validateAlphanumeric('Hello, world!'); // true

// Validate required field
const isRequired = validateRequired('Some value'); // true

// Validate length
const isValidLength = validateLength('Password', 8, 20); // true if between 8-20 chars
```

### 2. Sanitizing Input

```javascript
import { sanitizeString, sanitizeObject } from '../utils/inputValidation';

// Sanitize a string
const sanitizedText = sanitizeString('<script>alert("XSS")</script>Hello'); // "Hello"

// Sanitize an object
const sanitizedObject = sanitizeObject({
  name: '<script>alert("XSS")</script>John',
  email: 'john@example.com',
  nested: {
    bio: '<img src="x" onerror="alert(1)">Web developer'
  }
});
// Result: { name: "John", email: "john@example.com", nested: { bio: "Web developer" } }
```

### 3. Using with React Hook Form

```javascript
import { useForm } from 'react-hook-form';
import { createValidationRules, sanitizeObject } from '../utils/inputValidation';

const { register, handleSubmit, formState: { errors } } = useForm();

// Create validation rules
const nameRules = createValidationRules({
  required: true,
  requiredMessage: 'Name is required',
  minLength: 2,
  maxLength: 50
});

// Use in form
<input {...register('name', nameRules)} />
{errors.name && <span>{errors.name.message}</span>}

// Handle form submission
const onSubmit = (data) => {
  // Sanitize data before processing
  const sanitizedData = sanitizeObject(data);
  // Process sanitized data...
};
```

## Best Practices

When working with the Nexus LARP codebase, follow these validation and sanitization best practices:

1. **Always validate user input**: Use the validation utility to validate all user input
2. **Always sanitize user input**: Use the sanitization utility to sanitize all user input
3. **Provide user-friendly error messages**: Use the createValidationRules function to create validation rules with user-friendly error messages
4. **Validate on the client and server**: Client-side validation is for user experience, server-side validation is for security
5. **Use the appropriate validation function**: Choose the right validation function for the type of input

## Testing Validation and Sanitization

To test the validation and sanitization implementation:

1. Try submitting forms with invalid input and verify that validation errors are displayed
2. Try submitting forms with potentially malicious input (e.g., `<script>alert('XSS')</script>`) and verify that it's sanitized
3. Check the network tab to verify that sanitized data is sent to the server

## References

- [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [React Hook Form Documentation](https://react-hook-form.com/)