# Testing Guide for Nexus LARP Site

This document provides guidelines for testing the Nexus LARP site using Vitest and React Testing Library.

## Testing Framework

The Nexus LARP site uses the following testing tools:

- **Vitest**: A Vite-native testing framework that's fast and compatible with the Jest API
- **React Testing Library**: A library for testing React components in a user-centric way
- **@testing-library/jest-dom**: Provides custom DOM element matchers for Jest/Vitest
- **Happy DOM**: A browser environment simulator for running tests in Node.js

## Test Structure

Tests are organized alongside the code they test:

- Utility function tests: `src/utils/*.test.js`
- Component tests: `src/components/*/*.test.jsx`

## Running Tests

The following npm scripts are available for running tests:

- `npm test`: Run all tests once
- `npm run test:watch`: Run tests in watch mode (useful during development)
- `npm run test:coverage`: Run tests with coverage reporting

## Writing Tests

### Utility Function Tests

For testing utility functions, focus on input/output assertions:

```javascript
import { describe, it, expect } from 'vitest';
import myUtilityFunction from './myUtilityFunction';

describe('myUtilityFunction', () => {
  it('should handle normal input correctly', () => {
    expect(myUtilityFunction('normal input')).toBe('expected output');
  });

  it('should handle edge cases', () => {
    expect(myUtilityFunction(null)).toBe('default output');
    expect(myUtilityFunction('')).toBe('empty output');
  });
});
```

### Component Tests

For testing React components, focus on user interactions and rendered output:

```javascript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interactions', () => {
    const handleClick = vi.fn();
    render(<MyComponent onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Mocking Dependencies

For mocking dependencies, use Vitest's mocking capabilities:

```javascript
import { describe, it, expect, vi } from 'vitest';

// Mock a module
vi.mock('./dependencyModule', () => ({
  dependencyFunction: vi.fn().mockReturnValue('mocked value')
}));

// Mock a fetch call
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ data: 'mocked data' })
});
```

## Test Examples

### Utility Function Test Example

See `src/utils/authLevel.test.js` for an example of testing a utility function.

### Component Test Example

See `src/components/loading/loading.test.jsx` for an example of testing a React component.

## Best Practices

1. **Test behavior, not implementation**: Focus on what the code does, not how it does it
2. **Write readable tests**: Tests should be easy to understand and maintain
3. **Test edge cases**: Consider null values, empty strings, and other edge cases
4. **Keep tests independent**: Each test should run independently of others
5. **Use meaningful assertions**: Make assertions that verify important aspects of the code
6. **Mock external dependencies**: Use mocks for external services, APIs, etc.
7. **Aim for good coverage**: Try to cover all code paths, but prioritize critical functionality

## CI/CD Integration

Tests are automatically run as part of the CI/CD pipeline:

- Tests run on every push to the development branch
- Tests run before building and deploying a release
- Failed tests will prevent deployment