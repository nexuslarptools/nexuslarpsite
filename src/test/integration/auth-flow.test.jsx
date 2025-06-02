import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { TestWrapper } from './test-wrapper';
import MockApp from './app-mock';
import { mockAuthState } from './auth-mock';
import { clickButton, waitForLoadingToFinish } from './user-events';

// Mock the Auth0 hook
vi.mock('@auth0/auth0-react', async () => {
  const actual = await vi.importActual('@auth0/auth0-react');
  return {
    ...actual,
    useAuth0: vi.fn(() => mockAuthState.unauthenticated)
  };
});

describe('Authentication Flow', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up after each test
    vi.resetAllMocks();
  });

  it('shows login button when user is not authenticated', async () => {
    // Set up the mock to return unauthenticated state
    const { useAuth0 } = await import('@auth0/auth0-react');
    useAuth0.mockReturnValue(mockAuthState.unauthenticated);

    // Render the app
    render(
      <TestWrapper>
        <MockApp />
      </TestWrapper>
    );

    // Wait for the loading indicator to disappear
    await waitForLoadingToFinish();

    // Check that the login button is visible
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('shows user menu when user is authenticated', async () => {
    // Set up the mock to return authenticated state
    const { useAuth0 } = await import('@auth0/auth0-react');
    useAuth0.mockReturnValue(mockAuthState.authenticated);

    // Render the app
    render(
      <TestWrapper>
        <MockApp />
      </TestWrapper>
    );

    // Wait for the loading indicator to disappear
    await waitForLoadingToFinish();

    // Check that the user menu is visible
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
  });

  it('calls loginWithRedirect when login button is clicked', async () => {
    // Set up the mock to return unauthenticated state with spy on loginWithRedirect
    const loginWithRedirect = vi.fn();
    const { useAuth0 } = await import('@auth0/auth0-react');
    useAuth0.mockReturnValue({
      ...mockAuthState.unauthenticated,
      loginWithRedirect
    });

    // Render the app
    render(
      <TestWrapper>
        <MockApp />
      </TestWrapper>
    );

    // Wait for the loading indicator to disappear
    await waitForLoadingToFinish();

    // Click the login button
    await clickButton('Log In');

    // Check that loginWithRedirect was called
    expect(loginWithRedirect).toHaveBeenCalled();
  });

  it('calls logout when logout button is clicked', async () => {
    // Set up the mock to return authenticated state with spy on logout
    const logout = vi.fn();
    const { useAuth0 } = await import('@auth0/auth0-react');
    useAuth0.mockReturnValue({
      ...mockAuthState.authenticated,
      logout
    });

    // Render the app
    render(
      <TestWrapper>
        <MockApp />
      </TestWrapper>
    );

    // Wait for the loading indicator to disappear
    await waitForLoadingToFinish();

    // Click the user menu to open it
    const userMenu = screen.getByText(/john doe/i);
    await userMenu.click();

    // Wait for the logout button to appear
    await waitFor(() => {
      expect(screen.getByText(/log out/i)).toBeInTheDocument();
    });

    // Click the logout button
    const logoutButton = screen.getByText(/log out/i);
    await logoutButton.click();

    // Check that logout was called
    expect(logout).toHaveBeenCalled();
  });
});
