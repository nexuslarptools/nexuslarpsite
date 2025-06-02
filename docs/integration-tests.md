# Integration Tests for Nexus LARP Site

This document provides information about the integration tests for the Nexus LARP site, including the testing approach, test structure, and how to run the tests.

## Overview

Integration tests verify that different parts of the application work together correctly. The Nexus LARP site uses Vitest and React Testing Library to implement integration tests for key user flows.

## Test Structure

Integration tests are organized in the `src/test/integration` directory:

- **Test Files**: Each test file focuses on a specific user flow:
  - `auth-flow.test.jsx`: Tests authentication flows (login/logout)
  - `navigation-flow.test.jsx`: Tests navigation between different pages
  - `profile-flow.test.jsx`: Tests user profile viewing and editing
  - `items-flow.test.jsx`: Tests item viewing, creation, and editing
  - `search-flow.test.jsx`: Tests search functionality

- **Test Utilities**:
  - `test-wrapper.jsx`: Provides context providers for tests
  - `auth-mock.js`: Mocks Auth0 authentication
  - `api-mock.js`: Mocks API responses
  - `store-mock.js`: Mocks Zustand stores
  - `user-events.js`: Helper functions for simulating user interactions

## Testing Approach

The integration tests follow these principles:

1. **User-Centric Testing**: Tests simulate real user interactions like clicking buttons, filling forms, and navigating between pages.
2. **Isolation**: Tests use mocks to isolate the application from external dependencies like Auth0 and API endpoints.
3. **Comprehensive Coverage**: Tests cover all key user flows in the application.
4. **Realistic Scenarios**: Tests include both happy paths and error scenarios.

## Running the Tests

To run the integration tests:

```bash
# Run all tests
npm test

# Run tests in watch mode (useful during development)
npm run test:watch

# Run tests with coverage reporting
npm run test:coverage
```

## Writing New Integration Tests

When writing new integration tests, follow these guidelines:

1. **Use the TestWrapper**: Always wrap your components with the `TestWrapper` to provide necessary context:

```jsx
render(
  <TestWrapper>
    <YourComponent />
  </TestWrapper>
);
```

2. **Mock External Dependencies**: Use the provided mock utilities to mock Auth0, API calls, and stores:

```jsx
// Mock Auth0
vi.mock('@auth0/auth0-react', async () => {
  const actual = await vi.importActual('@auth0/auth0-react');
  return {
    ...actual,
    useAuth0: vi.fn(() => mockAuthState.authenticated)
  };
});

// Mock API calls
vi.mock('../../utils/apiGet', async () => {
  // ...
});
```

3. **Wait for Asynchronous Operations**: Use `waitFor` and `waitForLoadingToFinish` to handle asynchronous operations:

```jsx
// Wait for loading to finish
await waitForLoadingToFinish();

// Wait for specific elements to appear
await waitFor(() => {
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});
```

4. **Test User Interactions**: Use the provided helper functions to simulate user interactions:

```jsx
// Click a button
await clickButton('Submit');

// Fill a form field
await fillField('Username', 'testuser');
```

5. **Test Error Scenarios**: Make sure to test both successful and error scenarios:

```jsx
// Mock API error
apiGet.mockRejectedValueOnce(new Error('API Error'));

// Check that error message is displayed
await waitFor(() => {
  expect(screen.getByText(/error/i)).toBeInTheDocument();
});
```

## Example Test

Here's an example of a simple integration test:

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { TestWrapper } from './test-wrapper';
import App from '../../App';
import { mockAuthState } from './auth-mock';
import { waitForLoadingToFinish } from './user-events';

describe('Navigation Flow', () => {
  it('navigates to the profile page', async () => {
    // Mock Auth0 to return authenticated state
    const { useAuth0 } = await import('@auth0/auth0-react');
    useAuth0.mockReturnValue(mockAuthState.authenticated);

    // Render the app
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Wait for loading to finish
    await waitForLoadingToFinish();

    // Find and click the profile link
    const profileLink = screen.getByText(/profile/i);
    await profileLink.click();

    // Check that we're on the profile page
    await waitFor(() => {
      expect(screen.getByText(/user profile/i)).toBeInTheDocument();
    });
  });
});
```

## Troubleshooting

If you encounter issues with the integration tests:

1. **Check the Mocks**: Make sure the mocks are correctly set up for the components you're testing.
2. **Check the Selectors**: Make sure the selectors (like `getByText`) are finding the right elements.
3. **Use `screen.debug()`**: Add `screen.debug()` to see the current state of the DOM.
4. **Check for Asynchronous Issues**: Make sure you're using `waitFor` or `waitForLoadingToFinish` for asynchronous operations.