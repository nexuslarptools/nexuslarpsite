import { vi } from 'vitest';

// Mock Auth0 authentication states
export const mockAuthState = {
  // Unauthenticated state
  unauthenticated: {
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: null,
    loginWithRedirect: vi.fn(),
    logout: vi.fn(),
    getAccessTokenSilently: vi.fn().mockResolvedValue('mock-token')
  },
  
  // Authenticated state
  authenticated: {
    isAuthenticated: true,
    user: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      sub: 'auth0|123456789',
      picture: 'https://example.com/avatar.jpg'
    },
    isLoading: false,
    error: null,
    loginWithRedirect: vi.fn(),
    logout: vi.fn(),
    getAccessTokenSilently: vi.fn().mockResolvedValue('mock-token')
  }
};

// Function to get a custom auth state with specific properties
export const getCustomAuthState = (overrides = {}) => {
  return {
    ...mockAuthState.authenticated,
    ...overrides
  };
};

// Reset all auth mocks
export const resetAuthMocks = () => {
  mockAuthState.unauthenticated.loginWithRedirect.mockClear();
  mockAuthState.unauthenticated.logout.mockClear();
  mockAuthState.unauthenticated.getAccessTokenSilently.mockClear();
  
  mockAuthState.authenticated.loginWithRedirect.mockClear();
  mockAuthState.authenticated.logout.mockClear();
  mockAuthState.authenticated.getAccessTokenSilently.mockClear();
};