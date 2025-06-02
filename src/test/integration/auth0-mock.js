import { vi } from 'vitest';
import { mockAuthState } from './auth-mock';

// Create a mock function that can be used directly as the useAuth0 mock
export const mockUseAuth0 = vi.fn();

// Set the default implementation to return the authenticated state
mockUseAuth0.mockImplementation(() => mockAuthState.authenticated);

/**
 * Set the current auth state for testing
 * @param {string} state - 'authenticated' or 'unauthenticated'
 * @param {Object} overrides - Optional overrides for the auth state
 */
export const setAuthState = (state, overrides = {}) => {
  if (state === 'authenticated') {
    currentAuthState = { ...mockAuthState.authenticated, ...overrides };
  } else if (state === 'unauthenticated') {
    currentAuthState = { ...mockAuthState.unauthenticated, ...overrides };
  } else {
    throw new Error(`Invalid auth state: ${state}`);
  }
};

/**
 * Reset the auth state to the default (authenticated)
 */
export const resetAuthState = () => {
  currentAuthState = mockAuthState.authenticated;
};

/**
 * Create a custom auth state
 * @param {Object} overrides - Properties to override in the authenticated state
 * @returns {Object} Custom auth state
 */
export const createCustomAuthState = (overrides = {}) => {
  return { ...mockAuthState.authenticated, ...overrides };
};

// Mock withAuthenticationRequired HOC
export const mockWithAuthenticationRequired = (Component, options) => {
  return Component;
};
