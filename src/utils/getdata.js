import { useQuery } from '@tanstack/react-query'
import { apiGet, apiGetWithPage } from './apiGet'

export const useGetData = (statename, path) => {
  return useQuery({
    queryKey:[statename],
    queryFn: () => apiGet(path)});
}

export const useGetDataWitPage = (statename, path, page, numberPerPage) => {
  return useQuery({
    queryKey:[statename, page],
    queryFn: () => apiGetWithPage(path, page, numberPerPage)});
}

export const useGetDataWitNextPage = (statename, path, page, numberPerPage, queryClient, auth) => {
  return queryClient.prefetchQuery({
    queryKey:[statename, page],
     queryFn: () => apiGetWithPage(auth, path, page, numberPerPage)});
}

export const useGetDataWithStale = (statename, path) => {
  return useQuery({
    queryKey:[statename],
    queryFn: () => apiGet(path),
    refetchInterval: 300000});
}


export default useGetData