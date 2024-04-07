import configJson from '../auth_config.json'
import { getConfig } from '../config'

const {
    apiOrigin =
    configJson.APILocation
  } = getConfig()


export const apiPost = async (auth, path, bodystring) => {
  const token = await auth.getAccessTokenSilently();
  const response = await fetch(apiOrigin + path, {
    method: 'post',
    headers: {Authorization: `Bearer ${token}`, 
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json'},
    body: JSON.stringify(bodystring)
  }).then(response => response.json())
  return response;
}

export default apiPost