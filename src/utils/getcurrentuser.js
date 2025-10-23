import apiGet from './apiGet'
import { useQuery } from '@tanstack/react-query'

export const getUserData = (options) => {
  const enabled = options?.enabled ?? true;

  const userGuid = useQuery({
    queryKey:['currUserGuid'],
    queryFn: () => apiGet('/api/v1/Users/CurrentGuid'),
    enabled,
    staleTime: options?.staleTime,
    cacheTime: options?.cacheTime,
    refetchInterval: options?.refetchInterval,
    refetchOnWindowFocus: options?.refetchOnWindowFocus,
    refetchOnReconnect: options?.refetchOnReconnect,
    refetchOnMount: options?.refetchOnMount,
    retry: options?.retry,
  });

  const userId = userGuid?.data

  return useQuery({
    queryKey:['currUserInfo'],
    queryFn: () => apiGet('/api/v1/Users/' + userId),
    enabled: !!userId && enabled,
    staleTime: options?.staleTime,
    cacheTime: options?.cacheTime,
    refetchInterval: options?.refetchInterval,
    refetchOnWindowFocus: options?.refetchOnWindowFocus,
    refetchOnReconnect: options?.refetchOnReconnect,
    refetchOnMount: options?.refetchOnMount,
    retry: options?.retry,
  });
}

export default getUserData