import { useAuth0 } from '@auth0/auth0-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import apiPost from './apiPost'
import { logError, getUserFriendlyErrorMessage } from './errorHandler'

/**
 * Hook for making POST requests with proper error handling
 * @param {string} path - API endpoint path
 * @param {Array} relatedQs - Array of query keys to invalidate on success
 * @param {Function} onErrorCallback - Optional callback for custom error handling
 * @returns {Object} - React Query mutation object
 */
export const usePostData = (path, relatedQs, onErrorCallback) => {
  const queryClient = useQueryClient();
  const auth = useAuth0();

  return useMutation({
    mutationFn: (body) => apiPost(auth, path, body),
    onSuccess: () => 
      relatedQs.forEach(element => {
        queryClient.invalidateQueries({ queryKey: [element], refetchType: 'all' })
      }),
    onError: (error) => {
      // Use our centralized error handler to log the error safely
      logError(error, `usePostData: ${path}`);

      // Call the custom error callback if provided
      if (onErrorCallback && typeof onErrorCallback === 'function') {
        // Pass a user-friendly error message
        onErrorCallback(getUserFriendlyErrorMessage(error));
      }
    }
  });
}

export default usePostData
