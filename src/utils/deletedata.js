import { useAuth0 } from '@auth0/auth0-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import apiDelete from './apiDelete'



export const DeleteData = (path ,data) => {
    DeleteData(path, data)
}

export const useDeleteData = (path, relatedQs) => {
  const queryClient = useQueryClient();
  const auth = useAuth0();
  return useMutation({
    mutationFn: () => apiDelete(auth, path),
    onSuccess: () => 
    relatedQs.forEach(element => {
        queryClient.invalidateQueries({ queryKey: [element] })
    }),
    onError: (data) => {
        console.log('Delete error on ' + path, '  ' + data)}
    });
}

export default useDeleteData