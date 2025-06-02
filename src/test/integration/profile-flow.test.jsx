import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { TestWrapper } from './test-wrapper';
import MockApp from './app-mock';
import { mockAuthState } from './auth-mock';
import { clickButton, fillField, waitForLoadingToFinish } from './user-events';
import { mockApiResponses } from './api-mock';

// Mock the Auth0 hook
vi.mock('@auth0/auth0-react', async () => {
  const actual = await vi.importActual('@auth0/auth0-react');
  return {
    ...actual,
    useAuth0: vi.fn(() => mockAuthState.authenticated)
  };
});

// Mock API responses
vi.mock('../../utils/apiGet', async () => {
  const actual = await vi.importActual('../../utils/apiGet');
  return {
    ...actual,
    apiGet: vi.fn((auth, path) => {
      // Return mock user data for the current user endpoint
      if (path === '/api/v1/Users/Current') {
        return Promise.resolve(mockApiResponses.currentUser);
      }
      // Return mock permission data for the permission endpoint
      if (path === '/api/v1/Users/Permission') {
        return Promise.resolve(mockApiResponses.userPermission);
      }
      // Default fallback
      return Promise.resolve({});
    })
  };
});

// Mock API update
vi.mock('../../utils/apiPut', async () => {
  const actual = await vi.importActual('../../utils/apiPut');
  return {
    ...actual,
    apiPut: vi.fn(() => Promise.resolve({ success: true }))
  };
});

describe('User Profile Flow', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up after each test
    vi.resetAllMocks();
  });

  it('navigates to the profile page and displays user information', async () => {
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

    // Check that user information is displayed
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john.doe@example.com')).toBeInTheDocument();
  });

  it('allows editing user profile information', async () => {
    // Set up the mock to return authenticated state
    const { useAuth0 } = await import('@auth0/auth0-react');
    useAuth0.mockReturnValue(mockAuthState.authenticated);

    // Get the apiPut mock
    const { apiPut } = await import('../../utils/apiPut');

    // Render the app
    render(
      <TestWrapper>
        <MockApp />
      </TestWrapper>
    );

    // Wait for the loading indicator to disappear
    await waitForLoadingToFinish();

    // Navigate to profile page
    const userMenu = screen.getByText(/john doe/i);
    await userMenu.click();

    await waitFor(() => {
      expect(screen.getByText(/profile/i)).toBeInTheDocument();
    });

    const profileLink = screen.getByText(/profile/i);
    await profileLink.click();

    // Wait for profile page to load
    await waitFor(() => {
      expect(screen.getByText(/user profile/i)).toBeInTheDocument();
    });

    // Find the edit button and click it
    const editButton = screen.getByRole('button', { name: /edit/i });
    await editButton.click();

    // Wait for the form to become editable
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });

    // Edit the preferred name field
    const nameField = screen.getByLabelText(/preferred name/i);
    await fillField('Preferred Name', 'Jane Doe');

    // Click the save button
    const saveButton = screen.getByRole('button', { name: /save/i });
    await saveButton.click();

    // Check that apiPut was called with the updated data
    expect(apiPut).toHaveBeenCalledWith(
      expect.anything(),
      '/api/v1/Users/Current',
      expect.objectContaining({
        preferredname: 'Jane Doe'
      })
    );

    // Check that we're back in view mode
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    });
  });

  it('shows error message when profile update fails', async () => {
    // Set up the mock to return authenticated state
    const { useAuth0 } = await import('@auth0/auth0-react');
    useAuth0.mockReturnValue(mockAuthState.authenticated);

    // Get the apiPut mock and make it reject
    const { apiPut } = await import('../../utils/apiPut');
    apiPut.mockRejectedValueOnce(new Error('Failed to update profile'));

    // Render the app
    render(
      <TestWrapper>
        <MockApp />
      </TestWrapper>
    );

    // Wait for the loading indicator to disappear
    await waitForLoadingToFinish();

    // Navigate to profile page
    const userMenu = screen.getByText(/john doe/i);
    await userMenu.click();

    await waitFor(() => {
      expect(screen.getByText(/profile/i)).toBeInTheDocument();
    });

    const profileLink = screen.getByText(/profile/i);
    await profileLink.click();

    // Wait for profile page to load
    await waitFor(() => {
      expect(screen.getByText(/user profile/i)).toBeInTheDocument();
    });

    // Find the edit button and click it
    const editButton = screen.getByRole('button', { name: /edit/i });
    await editButton.click();

    // Wait for the form to become editable
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });

    // Edit the preferred name field
    const nameField = screen.getByLabelText(/preferred name/i);
    await fillField('Preferred Name', 'Jane Doe');

    // Click the save button
    const saveButton = screen.getByRole('button', { name: /save/i });
    await saveButton.click();

    // Check that an error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/failed to update profile/i)).toBeInTheDocument();
    });
  });
});
