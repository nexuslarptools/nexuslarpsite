import configJson from '../auth_config.json'
import { getConfig } from '../config'

const {
    apiOrigin =
    configJson.APILocation
  } = getConfig()

export const apiGet = async (auth, path) => {
  const token = await auth.getAccessTokenSilently();
  const response = await fetch(apiOrigin + path, {
    headers: {Authorization: `Bearer ${token}`}
  }).then(response => response.json())
  return response;
}

export const apiGetWithPage = async (auth, path, page, numberPerPage) => {
  const token = await auth.getAccessTokenSilently();
  const response = await fetch(apiOrigin + path + '?pageNumber=' + page + '&_pageSize=' + numberPerPage, {
    headers: {Authorization: `Bearer ${token}`}
  }).then(response => response.json())
  return response;
}

export default apiGet