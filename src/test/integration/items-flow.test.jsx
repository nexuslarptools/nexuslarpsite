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
      // Return mock items data for the items endpoint
      if (path === '/api/v1/Items') {
        return Promise.resolve(mockApiResponses['/api/v1/Items']);
      }
      // Return mock item data for a specific item endpoint
      if (path.startsWith('/api/v1/Items/') && path !== '/api/v1/Items/') {
        return Promise.resolve(mockApiResponses.singleItem);
      }
      // Return mock permission data for the permission endpoint
      if (path === '/api/v1/Users/Permission') {
        return Promise.resolve(mockApiResponses.userPermission);
      }
      // Default fallback
      return Promise.resolve({});
    }),
    apiGetWithPage: vi.fn(() => Promise.resolve(mockApiResponses['/api/v1/Items']))
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

// Mock API create
vi.mock('../../utils/apiPost', async () => {
  const actual = await vi.importActual('../../utils/apiPost');
  return {
    ...actual,
    apiPost: vi.fn(() => Promise.resolve({ success: true, guid: 'new-item-guid' }))
  };
});

describe('Items Flow', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up after each test
    vi.resetAllMocks();
  });

  it('navigates to the items page and displays items list', async () => {
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

    // Check that items are displayed
    await waitFor(() => {
      expect(screen.getByText(mockApiResponses['/api/v1/Items'].items[0].name)).toBeInTheDocument();
    });
  });

  it('allows viewing an item details', async () => {
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

    // Navigate to items page
    const itemsLink = screen.getByText(/items/i);
    await itemsLink.click();

    // Wait for items to load
    await waitFor(() => {
      expect(screen.getByText(/item management/i)).toBeInTheDocument();
    });

    // Find and click the view button for the first item
    const viewButtons = screen.getAllByRole('button', { name: /view/i });
    await viewButtons[0].click();

    // Check that we're on the item details page
    await waitFor(() => {
      expect(screen.getByText(/item details/i)).toBeInTheDocument();
    });

    // Check that item details are displayed
    expect(screen.getByText(mockApiResponses.singleItem.name)).toBeInTheDocument();
    expect(screen.getByText(mockApiResponses.singleItem.description)).toBeInTheDocument();
  });

  it('allows editing an item', async () => {
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

    // Navigate to items page
    const itemsLink = screen.getByText(/items/i);
    await itemsLink.click();

    // Wait for items to load
    await waitFor(() => {
      expect(screen.getByText(/item management/i)).toBeInTheDocument();
    });

    // Find and click the edit button for the first item
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    await editButtons[0].click();

    // Check that we're on the item edit page
    await waitFor(() => {
      expect(screen.getByText(/edit item/i)).toBeInTheDocument();
    });

    // Edit the item name
    const nameField = screen.getByLabelText(/name/i);
    await fillField('Name', 'Updated Item Name');

    // Click the save button
    const saveButton = screen.getByRole('button', { name: /save/i });
    await saveButton.click();

    // Check that apiPut was called with the updated data
    expect(apiPut).toHaveBeenCalledWith(
      expect.anything(),
      expect.stringContaining('/api/v1/Items/'),
      expect.objectContaining({
        name: 'Updated Item Name'
      })
    );

    // Check that we're back on the items list page
    await waitFor(() => {
      expect(screen.getByText(/item management/i)).toBeInTheDocument();
    });
  });

  it('allows creating a new item', async () => {
    // Set up the mock to return authenticated state
    const { useAuth0 } = await import('@auth0/auth0-react');
    useAuth0.mockReturnValue(mockAuthState.authenticated);

    // Get the apiPost mock
    const { apiPost } = await import('../../utils/apiPost');

    // Render the app
    render(
      <TestWrapper>
        <MockApp />
      </TestWrapper>
    );

    // Wait for the loading indicator to disappear
    await waitForLoadingToFinish();

    // Navigate to items page
    const itemsLink = screen.getByText(/items/i);
    await itemsLink.click();

    // Wait for items to load
    await waitFor(() => {
      expect(screen.getByText(/item management/i)).toBeInTheDocument();
    });

    // Find and click the new item button
    const newItemButton = screen.getByRole('button', { name: /new item/i });
    await newItemButton.click();

    // Check that we're on the new item page
    await waitFor(() => {
      expect(screen.getByText(/new item/i)).toBeInTheDocument();
    });

    // Fill in the item details
    await fillField('Name', 'New Test Item');
    await fillField('Description', 'This is a test item created by the integration test');

    // Click the save button
    const saveButton = screen.getByRole('button', { name: /save/i });
    await saveButton.click();

    // Check that apiPost was called with the new item data
    expect(apiPost).toHaveBeenCalledWith(
      expect.anything(),
      '/api/v1/Items',
      expect.objectContaining({
        name: 'New Test Item',
        description: 'This is a test item created by the integration test'
      })
    );

    // Check that we're back on the items list page
    await waitFor(() => {
      expect(screen.getByText(/item management/i)).toBeInTheDocument();
    });
  });

  it('shows error message when item update fails', async () => {
    // Set up the mock to return authenticated state
    const { useAuth0 } = await import('@auth0/auth0-react');
    useAuth0.mockReturnValue(mockAuthState.authenticated);

    // Get the apiPut mock and make it reject
    const { apiPut } = await import('../../utils/apiPut');
    apiPut.mockRejectedValueOnce(new Error('Failed to update item'));

    // Render the app
    render(
      <TestWrapper>
        <MockApp />
      </TestWrapper>
    );

    // Wait for the loading indicator to disappear
    await waitForLoadingToFinish();

    // Navigate to items page
    const itemsLink = screen.getByText(/items/i);
    await itemsLink.click();

    // Wait for items to load
    await waitFor(() => {
      expect(screen.getByText(/item management/i)).toBeInTheDocument();
    });

    // Find and click the edit button for the first item
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    await editButtons[0].click();

    // Check that we're on the item edit page
    await waitFor(() => {
      expect(screen.getByText(/edit item/i)).toBeInTheDocument();
    });

    // Edit the item name
    const nameField = screen.getByLabelText(/name/i);
    await fillField('Name', 'Updated Item Name');

    // Click the save button
    const saveButton = screen.getByRole('button', { name: /save/i });
    await saveButton.click();

    // Check that an error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/failed to update item/i)).toBeInTheDocument();
    });
  });
});
