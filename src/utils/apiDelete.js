import configJson from '../auth_config.json'
import { getConfig } from '../config'

const {
    apiOrigin =
    configJson.APILocation
  } = getConfig()


export const apiDelete = async (auth, path) => {
  const token = await auth.getAccessTokenSilently();
  const response = await fetch(apiOrigin + path, {
    method: 'delete',
    headers: {Authorization: `Bearer ${token}`, 
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json'}
  }).then(response => response.json())
  return response;
}

export default apiDelete