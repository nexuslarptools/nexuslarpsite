import { useEffect, useMemo, useState } from 'react'
import { getConfig } from '../../config'

function maskSensitive(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const isTokenKey = (k) => k.toLowerCase().includes('token') || k.toLowerCase().includes('secret') || k.toLowerCase().includes('password');
  const masked = {};
  for (const [k, v] of Object.entries(obj)) {
    if (isTokenKey(k)) masked[k] = typeof v === 'string' ? v.replace(/.(?=.{4})/g, '*') : '***';
    else masked[k] = v;
  }
  return masked;
}

function parseParams(search) {
  const o = {};
  const usp = new URLSearchParams(search || '');
  usp.forEach((v, k) => { o[k] = v; });
  return o;
}

export default function OAuthLogout() {
  const [status, setStatus] = useState('starting');
  const [message, setMessage] = useState('');

  const current = useMemo(() => {
    const url = window.location.href;
    const { pathname, search, hash } = window.location;
    const queryParams = parseParams(search);
    const hashParams = parseParams(hash?.startsWith('#') ? hash.slice(1) : '');
    // eslint-disable-next-line no-console
    console.log('[OAuthLogout] Request received:', {
      url,
      pathname,
      search,
      hash,
      queryParams: maskSensitive(queryParams),
      hashParams: maskSensitive(hashParams),
    });
    return { url, pathname, search, hash, queryParams, hashParams };
  }, []);

  useEffect(() => {
    const cfg = getConfig();

    const redirect = current.queryParams.redirect || current.queryParams.post_logout_redirect_uri || '/';

    const usingMiddleware = !cfg.OIDC_AUTHORIZATION_ENDPOINT; // If no direct OIDC settings, assume Traefik/BFF

    if (usingMiddleware) {
      // Redirect to Traefik forward-auth logout endpoint with return URL
      const retUrl = encodeURIComponent(redirect.startsWith('http') ? redirect : `${window.location.origin}${redirect}`);
      const mwLogout = cfg.OAUTH_MIDDLEWARE_LOGOUT_PATH || '/oauth/logout';
      // traefikoidc expects `rd` param; we also include `redirect` for broader compatibility
      const rdParam = cfg.OAUTH_MIDDLEWARE_REDIRECT_PARAM || 'rd';
      const url = `${mwLogout}?${rdParam}=${retUrl}&redirect=${retUrl}`;
      // eslint-disable-next-line no-console
      console.log('[OIDC] Middleware mode: redirecting to logout endpoint', { url });
      window.location.replace(url);
      return;
    }

    const endpoint = `${cfg.apiOrigin}${cfg.OAUTH_LOGOUT_PATH}`;
    const payload = { redirect, url: current.url };
    // eslint-disable-next-line no-console
    console.log('[OIDC] Calling backend logout with params:', { endpoint, params: payload });

    setStatus('calling');

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const text = await res.text();
        let json = null;
        try { json = JSON.parse(text); } catch { /* ignore */ }
        if (!res.ok) {
          throw new Error(`Logout failed: ${res.status} ${res.statusText} ${text?.slice(0, 200)}`);
        }
        // eslint-disable-next-line no-console
        console.log('[OIDC] Logout success. Response (masked):', maskSensitive(json || { text }));
      })
      .then(() => {
        setStatus('done');
        setTimeout(() => {
          const finalRedirect = redirect || '/';
          window.location.replace(finalRedirect);
        }, 250);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('[OIDC] Logout error:', err);
        setStatus('error');
        setMessage(err?.message || 'Unknown error during logout');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>OAuth Logout</h1>
      <p>Status: {status}</p>
      {message && <pre style={{ whiteSpace: 'pre-wrap' }}>{message}</pre>}
    </div>
  );
}
