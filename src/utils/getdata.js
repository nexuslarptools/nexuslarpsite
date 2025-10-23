import { useQuery } from '@tanstack/react-query'
import { apiGet, apiGetWithPage } from './apiGet'

export const useGetData = (statename, path, options) => {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000,
    refetchInterval = false,
    refetchOnWindowFocus = false,
    refetchOnReconnect = true,
    refetchOnMount = false,
    retry = 1,
  } = options || {};

  return useQuery({
    queryKey:[statename],
    queryFn: () => apiGet(path),
    enabled,
    staleTime,
    cacheTime: Math.max(staleTime * 2, 10 * 60 * 1000),
    refetchInterval,
    refetchOnWindowFocus,
    refetchOnReconnect,
    refetchOnMount,
    retry,
  });
}

export const useGetDataWitPage = (statename, path, page, numberPerPage, options) => {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000,
    refetchInterval = false,
    refetchOnWindowFocus = false,
    refetchOnReconnect = true,
    refetchOnMount = false,
    retry = 1,
  } = options || {};

  return useQuery({
    queryKey:[statename, page],
    queryFn: () => apiGetWithPage(path, page, numberPerPage),
    enabled,
    staleTime,
    cacheTime: Math.max(staleTime * 2, 10 * 60 * 1000),
    refetchInterval,
    refetchOnWindowFocus,
    refetchOnReconnect,
    refetchOnMount,
    retry,
  });
}

export const useGetDataWitNextPage = (statename, path, page, numberPerPage, queryClient, options) => {
  const enabled = options?.enabled ?? true;
  if (!enabled) return Promise.resolve();
  return queryClient.prefetchQuery({
    queryKey:[statename, page],
     queryFn: () => apiGetWithPage(path, page, numberPerPage)});
}

export const useGetDataWithStale = (statename, path, options) => {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    refetchInterval = false, // no polling by default
    refetchOnWindowFocus = false,
    refetchOnReconnect = true,
    refetchOnMount = false, // don't refetch on every mount
    retry = 1,
  } = options || {};

  return useQuery({
    queryKey:[statename],
    queryFn: () => apiGet(path),
    enabled,
    staleTime,
    cacheTime: Math.max(staleTime * 2, 10 * 60 * 1000), // keep in cache a bit longer
    refetchInterval,
    refetchOnWindowFocus,
    refetchOnReconnect,
    refetchOnMount,
    retry,
  });
}


export default useGetData