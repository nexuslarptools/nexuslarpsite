import { useAuth0 } from '@auth0/auth0-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import apiDelete from './apiDelete'
import { logError, getUserFriendlyErrorMessage } from './errorHandler'

/**
 * Hook for making DELETE requests with proper error handling
 * @param {string} path - API endpoint path
 * @param {Array} relatedQs - Array of query keys to invalidate on success
 * @param {Function} onErrorCallback - Optional callback for custom error handling
 * @returns {Object} - React Query mutation object
 */
export const useDeleteData = (path, relatedQs, onErrorCallback) => {
  const queryClient = useQueryClient();
  const auth = useAuth0();

  return useMutation({
    mutationFn: () => apiDelete(auth, path),
    onSuccess: () => 
      relatedQs.forEach(element => {
        queryClient.invalidateQueries({ queryKey: [element] })
      }),
    onError: (error) => {
      // Use our centralized error handler to log the error safely
      logError(error, `useDeleteData: ${path}`);

      // Call the custom error callback if provided
      if (onErrorCallback && typeof onErrorCallback === 'function') {
        // Pass a user-friendly error message
        onErrorCallback(getUserFriendlyErrorMessage(error));
      }
    }
  });
}

export default useDeleteData
