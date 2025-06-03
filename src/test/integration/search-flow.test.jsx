import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { TestWrapper } from './test-wrapper';
import MockApp from './app-mock';
import { mockAuthState } from './auth-mock';
import { clickButton, fillField, waitForLoadingToFinish } from './user-events';
import { mockApiResponses, setMockApiResponse, mockApiGet } from './api-mock';

// Mock the Auth0 hook
vi.mock('@auth0/auth0-react', async () => {
  const actual = await vi.importActual('@auth0/auth0-react');
  return {
    ...actual,
    useAuth0: vi.fn(() => mockAuthState.authenticated)
  };
});

// Mock API responses for search
const mockSearchResults = {
  characters: [
    { id: 'char1', name: 'Character One', description: 'First test character' },
    { id: 'char2', name: 'Character Two', description: 'Second test character' }
  ],
  items: [
    { id: 'item1', name: 'Item One', description: 'First test item' },
    { id: 'item2', name: 'Item Two', description: 'Second test item' }
  ]
};

describe('Search Flow', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Set up mock API responses
    setMockApiResponse('/api/v1/Search', mockSearchResults);

    // Reset mockApiGet implementation
    mockApiGet.mockImplementation((auth, path) => {
      // Return mock search results for the search endpoint
      if (path.includes('/api/v1/Search')) {
        return Promise.resolve(mockSearchResults);
      }
      // Return mock permission data for the permission endpoint
      if (path === '/api/v1/Users/Permission') {
        return Promise.resolve(mockApiResponses.userPermission);
      }
      // Default fallback
      return Promise.resolve({});
    });
  });

  afterEach(() => {
    // Clean up after each test
    vi.resetAllMocks();
  });

  it('opens the search drawer and performs a search', async () => {
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

    // Find and click the search button to open the drawer
    const searchButton = screen.getByRole('button', { name: /search/i });
    await searchButton.click();

    // Check that the search drawer is open
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    });

    // Enter a search term
    const searchInput = screen.getByPlaceholderText(/search/i);
    await fillField(searchInput, 'test');

    // Click the search submit button
    const searchSubmitButton = screen.getByRole('button', { name: /submit search/i });
    await searchSubmitButton.click();

    // Check that the API was called with the search term
    expect(mockApiGet).toHaveBeenCalledWith(
      expect.anything(),
      expect.stringContaining('/api/v1/Search?q=test')
    );

    // Check that search results are displayed
    await waitFor(() => {
      expect(screen.getByText('Character One')).toBeInTheDocument();
      expect(screen.getByText('Item One')).toBeInTheDocument();
    });
  });

  it('navigates to a search result when clicked', async () => {
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

    // Find and click the search button to open the drawer
    const searchButton = screen.getByRole('button', { name: /search/i });
    await searchButton.click();

    // Enter a search term and submit
    const searchInput = screen.getByPlaceholderText(/search/i);
    await fillField(searchInput, 'test');
    const searchSubmitButton = screen.getByRole('button', { name: /submit search/i });
    await searchSubmitButton.click();

    // Wait for search results to appear
    await waitFor(() => {
      expect(screen.getByText('Character One')).toBeInTheDocument();
    });

    // Click on a character result
    const characterResult = screen.getByText('Character One');
    await act(async () => {
      await characterResult.click();
    });

    // Check that we navigate to the character details page
    await waitFor(() => {
      expect(screen.getByText(/character details/i)).toBeInTheDocument();
    });
  });

  it('shows a message when no search results are found', async () => {
    // Set up the mock to return authenticated state
    const { useAuth0 } = await import('@auth0/auth0-react');
    useAuth0.mockReturnValue(mockAuthState.authenticated);

    // Make the apiGet mock return empty results
    mockApiGet.mockImplementationOnce((auth, path) => {
      if (path.includes('/api/v1/Search')) {
        return Promise.resolve({ characters: [], items: [] });
      }
      return Promise.resolve({});
    });

    // Render the app
    render(
      <TestWrapper>
        <MockApp />
      </TestWrapper>
    );

    // Wait for the loading indicator to disappear
    await waitForLoadingToFinish();

    // Find and click the search button to open the drawer
    const searchButton = screen.getByRole('button', { name: /search/i });
    await searchButton.click();

    // Enter a search term and submit
    const searchInput = screen.getByPlaceholderText(/search/i);
    await fillField(searchInput, 'nonexistent');
    const searchSubmitButton = screen.getByRole('button', { name: /submit search/i });
    await searchSubmitButton.click();

    // Check that a "no results" message is displayed
    await waitFor(() => {
      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    });
  });

  it('handles search errors gracefully', async () => {
    // Set up the mock to return authenticated state
    const { useAuth0 } = await import('@auth0/auth0-react');
    useAuth0.mockReturnValue(mockAuthState.authenticated);

    // Make the apiGet mock reject
    mockApiGet.mockRejectedValueOnce(new Error('Search failed'));

    // Render the app
    render(
      <TestWrapper>
        <MockApp />
      </TestWrapper>
    );

    // Wait for the loading indicator to disappear
    await waitForLoadingToFinish();

    // Find and click the search button to open the drawer
    const searchButton = screen.getByRole('button', { name: /search/i });
    await searchButton.click();

    // Enter a search term and submit
    const searchInput = screen.getByPlaceholderText(/search/i);
    await fillField(searchInput, 'test');
    const searchSubmitButton = screen.getByRole('button', { name: /submit search/i });
    await searchSubmitButton.click();

    // Check that an error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/search failed/i)).toBeInTheDocument();
    });
  });
});
