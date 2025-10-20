import configJson from '../auth_config.json'
import { getConfig } from '../config'

const {
    apiOrigin =
    configJson.APILocation
  } = getConfig()

export const apiDelete = async (path) => {
  const res = await fetch(apiOrigin + path, {
    method: 'delete',
    credentials: 'include',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  });
  const contentType = res.headers.get('content-type') || '';
  if (!res.ok) {
    const errText = contentType.includes('application/json') ? await res.json().catch(() => ({})) : await res.text().catch(() => '');
    throw new Error(`[apiDelete] ${res.status} ${res.statusText}: ${typeof errText === 'string' ? errText : JSON.stringify(errText)}`);
  }
  return contentType.includes('application/json') ? res.json() : res.text();
}

export default apiDelete