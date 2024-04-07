import { useAuth0 } from '@auth0/auth0-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import apiPut from './apiPut'

/* export const PutData = (path ,data) => {
    PutData(path, data)
} */

export const usePutData = (path, relatedQs) => {
  const queryClient = useQueryClient();
  const auth = useAuth0();
  return useMutation({
    mutationFn: (body) => apiPut(auth, path, body),
    onSuccess: () => 
    relatedQs.forEach(element => {
        queryClient.invalidateQueries({ queryKey: [element], refetchType: 'all'})
    }),
    onError: (data) => {
        console.log('Put error on ' + path, '  ' + data)}
    });
}

export default usePutData