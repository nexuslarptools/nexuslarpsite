import apiGet from './apiGet'
import { useQuery } from '@tanstack/react-query'

export const getUserData = () => {
  const userGuid = useQuery({
    queryKey:['currUserGuid'],
    queryFn: () => apiGet('/api/v1/Users/CurrentGuid')});

  const userId = userGuid?.data

  return useQuery({
    queryKey:['currUserInfo'],
    queryFn: () => apiGet('/api/v1/Users/' + userId),
    enabled: !!userId,});
}

export default getUserData