import apiGet from './apiGet'
import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'

export const getUserData = () => {
  const auth = useAuth0();

  const userGuid = useQuery({
    queryKey:['currUserGuid'],
    queryFn: () => apiGet(auth, '/api/v1/Users/CurrentGuid')});

  const userId = userGuid?.data

  return useQuery({
    queryKey:['currUserInfo'],
    queryFn: () => apiGet(auth, '/api/v1/Users/' + userId),
    enabled: !!userId,});
}

export default getUserData