import configJson from '../auth_config.json'
import { getConfig } from '../config'

const {
    apiOrigin =
    configJson.APILocation
  } = getConfig()

export const apiGet = async (path) => {
  const response = await fetch(apiOrigin + path, {
    credentials: 'include',
  }).then(response => response.json())
  return response;
}

export const apiGetWithPage = async (path, page, numberPerPage) => {
  const response = await fetch(apiOrigin + path + '?pageNumber=' + page + '&_pageSize=' + numberPerPage, {
    credentials: 'include',
  }).then(response => response.json())
  return response;
}

export default apiGet