import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { TestWrapper } from './test-wrapper';
import MockApp from './app-mock';
import { mockAuthState } from './auth-mock';
import { clickLink, waitForLoadingToFinish } from './user-events';

// Mock the Auth0 hook
vi.mock('@auth0/auth0-react', async () => {
  const actual = await vi.importActual('@auth0/auth0-react');
  return {
    ...actual,
    useAuth0: vi.fn(() => mockAuthState.authenticated)
  };
});

describe('Navigation Flow', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up after each test
    vi.resetAllMocks();
  });

  it('navigates to the home page by default', async () => {
    // Render the app
    render(
      <TestWrapper>
        <MockApp />
      </TestWrapper>
    );

    // Wait for the loading indicator to disappear
    await waitForLoadingToFinish();

    // Check that we're on the home page
    expect(screen.getByText(/welcome to nexus/i)).toBeInTheDocument();
  });

  it('navigates to the profile page when profile link is clicked', async () => {
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

    // Click the user menu to open it
    const userMenu = screen.getByText(/john doe/i);
    await userMenu.click();

    // Wait for the profile link to appear
    await waitFor(() => {
      expect(screen.getByText(/profile/i)).toBeInTheDocument();
    });

    // Click the profile link
    const profileLink = screen.getByText(/profile/i);
    await profileLink.click();

    // Check that we're on the profile page
    await waitFor(() => {
      expect(screen.getByText(/user profile/i)).toBeInTheDocument();
    });
  });

  it('navigates to the items page when items link is clicked', async () => {
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

    // Find and click the Items link in the navigation
    const itemsLink = screen.getByText(/items/i);
    await itemsLink.click();

    // Check that we're on the items page
    await waitFor(() => {
      expect(screen.getByText(/item management/i)).toBeInTheDocument();
    });
  });

  it('navigates to the characters page when characters link is clicked', async () => {
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

    // Find and click the Characters link in the navigation
    const charactersLink = screen.getByText(/characters/i);
    await charactersLink.click();

    // Check that we're on the characters page
    await waitFor(() => {
      expect(screen.getByText(/character management/i)).toBeInTheDocument();
    });
  });

  it('navigates to the series page when series link is clicked', async () => {
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

    // Find and click the Series link in the navigation
    const seriesLink = screen.getByText(/series/i);
    await seriesLink.click();

    // Check that we're on the series page
    await waitFor(() => {
      expect(screen.getByText(/series list/i)).toBeInTheDocument();
    });
  });

  it('navigates back to the home page when logo is clicked', async () => {
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

    // First navigate to another page
    const itemsLink = screen.getByText(/items/i);
    await itemsLink.click();

    // Wait for the items page to load
    await waitFor(() => {
      expect(screen.getByText(/item management/i)).toBeInTheDocument();
    });

    // Find and click the logo to go back to home
    const logo = screen.getByAltText(/nexus logo/i);
    await logo.click();

    // Check that we're back on the home page
    await waitFor(() => {
      expect(screen.getByText(/welcome to nexus/i)).toBeInTheDocument();
    });
  });
});
