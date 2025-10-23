import { useEffect, useMemo, useState } from 'react'
import { getConfig } from '../../config'

function maskSensitive(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const lowered = Object.fromEntries(Object.entries(obj).map(([k, v]) => [k.toLowerCase(), v]));
  const isTokenKey = (k) => k.includes('token') || k.includes('secret') || k.includes('password');
  const masked = {};
  for (const [k, v] of Object.entries(obj)) {
    if (isTokenKey(k.toLowerCase())) masked[k] = typeof v === 'string' ? v.replace(/.(?=.{4})/g, '*') : '***';
    else masked[k] = v;
  }
  return masked;
}

function parseParams(search) {
  const o = {};
  const usp = new URLSearchParams(search || '');
  usp.forEach((v, k) => {
    o[k] = v;
  });
  return o;
}

export default function OAuthCallback() {
  const [status, setStatus] = useState('starting');
  const [message, setMessage] = useState('');

  const current = useMemo(() => {
    const url = window.location.href;
    const { pathname, search, hash } = window.location;
    const queryParams = parseParams(search);
    const hashParams = parseParams(hash?.startsWith('#') ? hash.slice(1) : '');
    // eslint-disable-next-line no-console
    console.log('[OAuthCallback] Request received:', {
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

    // After backend token exchange, the middleware/back-end redirects here with session info
    const redirect = current.queryParams.redirect || current.queryParams.returnTo || '/';

    const sessionPayload = { ...current.queryParams, ...current.hashParams, url: current.url };
    // eslint-disable-next-line no-console
    console.log('[OAuthCallback] Post-exchange session received (masked):', maskSensitive(sessionPayload));

    try {
      const sanitized = maskSensitive(sessionPayload);
      window.sessionStorage.setItem('sessionInfo', JSON.stringify(sanitized));
    } catch {}

    // Mark session active for client-side gating; actual auth is established via HttpOnly cookie
    try { window.localStorage.setItem('sessionActive', 'true'); } catch {}

    setStatus('done');
    setTimeout(() => {
      const finalRedirect = redirect || '/';
      window.location.replace(finalRedirect);
    }, 150);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>OAuth Callback</h1>
      <p>Status: {status}</p>
      {message && <pre style={{ whiteSpace: 'pre-wrap' }}>{message}</pre>}
      {status === 'no-code' && (
        <p>No authorization code was found. You can return to the <a href="/">home page</a>.</p>
      )}
    </div>
  );
}
