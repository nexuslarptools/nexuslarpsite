import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'
import { apiGet, apiGetWithPage } from './apiGet'

export const useGetData = (statename, path) => {
  try {
  const auth = useAuth0();
  return useQuery({
    queryKey:[statename],
    queryFn: () => apiGet(auth, path)
  })
}
catch(error) {
  console.log(error);
  throw error;
}
}

export const useGetDataWitPage = (statename, path, page, numberPerPage) => {
  const auth = useAuth0();
  return useQuery({
    queryKey:[statename, page],
    queryFn: () => apiGetWithPage(auth, path, page, numberPerPage)});
}

export const useGetDataWitNextPage = (statename, path, page, numberPerPage, queryClient, auth) => {
  return queryClient.prefetchQuery({
    queryKey:[statename, page],
     queryFn: () => apiGetWithPage(auth, path, page, numberPerPage)});
}

export const useGetDataWithStale = (statename, path) => {
  const auth = useAuth0();
  return useQuery({
    queryKey:[statename],
    queryFn: () => apiGet(auth, path),
    refetchInterval: 300000});
}

export default useGetData