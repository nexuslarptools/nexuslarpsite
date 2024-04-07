import { useAuth0 } from '@auth0/auth0-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import apiPost from './apiPost'

export const PostData = (path ,data) => {
    PostData(path, data)
}

export const usePostData = (path, relatedQs) => {
  const queryClient = useQueryClient();
  const auth = useAuth0();
  return useMutation({
    mutationFn: (body) => apiPost(auth, path, body),
    onSuccess: () => 
    relatedQs.forEach(element => {
        queryClient.invalidateQueries({ queryKey: [element], refetchType: 'all' })
    }),
    onError: (data) => {
        console.log('Post error on ' + path, '  ' + data)}
    });
}

export default usePostData