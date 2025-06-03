import { vi } from 'vitest';

// Mock API responses
export const mockApiResponses = {
  // User data
  '/api/v1/Users/Permission': { AuthLevel: 'Reader' },
  '/api/v1/Users/Current': {
    id: '123',
    email: 'test@example.com',
    preferredname: 'Test User',
    authLevel: 'Reader'
  },

  // Characters data
  '/api/v1/Characters': [
    { id: '1', name: 'Character 1', description: 'Test character 1' },
    { id: '2', name: 'Character 2', description: 'Test character 2' }
  ],

  // Items data
  '/api/v1/Items': {
    items: [
      { id: '1', name: 'Item 1', description: 'Test item 1' },
      { id: '2', name: 'Item 2', description: 'Test item 2' }
    ]
  },
  // Single item data
  'singleItem': { id: '1', name: 'Item 1', description: 'Test item 1' },

  // Series data
  '/api/v1/Series': [
    { id: '1', name: 'Series 1' },
    { id: '2', name: 'Series 2' }
  ],

  // Tags data
  '/api/v1/Tags': [
    { id: '1', name: 'Tag 1' },
    { id: '2', name: 'Tag 2' }
  ],

  // Larps data
  '/api/v1/Larps': [
    { id: '1', name: 'Larp 1' },
    { id: '2', name: 'Larp 2' }
  ]
};

// Function to set custom mock responses for specific endpoints
export const setMockApiResponse = (path, response) => {
  mockApiResponses[path] = response;
};

// Mock API functions
export const mockApiGet = vi.fn().mockImplementation((auth, path) => {
  if (mockApiResponses[path]) {
    return Promise.resolve(mockApiResponses[path]);
  }
  return Promise.reject(new Error(`No mock response for ${path}`));
});

export const mockApiGetWithPage = vi.fn().mockImplementation((auth, path, page, numberPerPage) => {
  if (mockApiResponses[path]) {
    const data = mockApiResponses[path];
    if (Array.isArray(data)) {
      const start = (page - 1) * numberPerPage;
      const end = start + numberPerPage;
      return Promise.resolve(data.slice(start, end));
    }
    return Promise.resolve(data);
  }
  return Promise.reject(new Error(`No mock response for ${path}`));
});

export const mockApiPost = vi.fn().mockImplementation((auth, path, body) => {
  // For POST requests, we'll just return the body with an id
  return Promise.resolve({ id: 'new-id', ...body });
});

export const mockApiPut = vi.fn().mockImplementation((auth, path, body) => {
  // For PUT requests, we'll just return the body
  return Promise.resolve(body);
});

export const mockApiDelete = vi.fn().mockImplementation((auth, path) => {
  // For DELETE requests, we'll just return success
  return Promise.resolve({ success: true });
});

// Reset all mocks
export const resetApiMocks = () => {
  mockApiGet.mockClear();
  mockApiGetWithPage.mockClear();
  mockApiPost.mockClear();
  mockApiPut.mockClear();
  mockApiDelete.mockClear();
};
