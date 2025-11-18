import configJson from '../auth_config.json'
import { getConfig } from '../config'

const {
    apiOrigin =
    configJson.APILocation
  } = getConfig()

export const apiGet = async (path) => {
  const res = await fetch(apiOrigin + path, {
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request failed: ${res.status} ${res.statusText} ${text?.slice(0, 200)}`);
  }
  return res.json();
}

export const apiGetWithPage = async (path, page, numberPerPage) => {
  const res = await fetch(apiOrigin + path + '?pageNumber=' + page + '&_pageSize=' + numberPerPage, {
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request failed: ${res.status} ${res.statusText} ${text?.slice(0, 200)}`);
  }
  return res.json();
}

export default apiGet