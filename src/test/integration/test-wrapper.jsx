import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { render } from '@testing-library/react';
import { mockUseAuth0 } from './auth0-mock';
import { mockApiGet, mockApiGetWithPage, mockApiPost, mockApiPut, mockApiDelete } from './api-mock';
import { mockUseUIStore, mockUseCharactersStore, mockUseItemsStore } from './store-mock';

// Mock the Auth0 hook
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: mockUseAuth0,
  withAuthenticationRequired: (component, _) => component
}));

// Mock the API utility functions
vi.mock('../../utils/apiGet', () => ({
  default: mockApiGet,
  apiGet: mockApiGet,
  apiGetWithPage: mockApiGetWithPage
}));

vi.mock('../../utils/apiPost', () => ({
  default: mockApiPost,
  apiPost: mockApiPost
}));

vi.mock('../../utils/apiPut', () => ({
  default: mockApiPut,
  apiPut: mockApiPut
}));

vi.mock('../../utils/apiDelete', () => ({
  default: mockApiDelete,
  apiDelete: mockApiDelete
}));

// Mock Zustand stores
vi.mock('../../store', () => ({
  useUIStore: (selector) => mockUseUIStore(selector),
  useCharactersStore: (selector) => mockUseCharactersStore(selector),
  useItemsStore: (selector) => mockUseItemsStore(selector)
}));

// Mock SVG imports
vi.mock('../../assets/loading.svg', () => ({
  default: 'mocked-loading.svg'
}));

// Create a new QueryClient for each test
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
      staleTime: 0,
      refetchOnWindowFocus: false
    }
  }
});

/**
 * Test wrapper component that provides all necessary context providers
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Children to render
 * @param {Object} props.queryClient - Optional QueryClient instance
 * @returns {JSX.Element} - Wrapped component
 */
export const TestWrapper = ({ children, queryClient = createTestQueryClient() }) => {
  return (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </MemoryRouter>
  );
};

/**
 * Render a component with all necessary context providers
 * @param {JSX.Element} ui - Component to render
 * @param {Object} options - Render options
 * @returns {Object} - Rendered component
 */
export const renderWithProviders = (ui, options = {}) => {
  const { queryClient = createTestQueryClient(), ...renderOptions } = options;

  return {
    ...render(
      <TestWrapper queryClient={queryClient}>
        {ui}
      </TestWrapper>,
      renderOptions
    )
  };
};

export default TestWrapper;
