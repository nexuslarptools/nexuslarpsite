import configJson from '../auth_config.json'
import { getConfig } from '../config'

const {
    apiOrigin =
    configJson.APILocation
  } = getConfig()


export const apiGet = async (path) => {
  const response = await fetch(apiOrigin + path, {
    headers: {}
  }).then(response => response.json())
  return response;
}

export const apiGetWithPage = async (path, page, numberPerPage) => {
  const response = await fetch(apiOrigin + path + '?pageNumber=' + page + '&_pageSize=' + numberPerPage, {
    headers: {}
  }).then(response => response.json())
  return response;
}

export default apiGet