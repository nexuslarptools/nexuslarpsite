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

    const code = current.queryParams.code || current.hashParams.code;
    const state = current.queryParams.state || current.hashParams.state;
    const redirect = current.queryParams.redirect || current.queryParams.returnTo || '/';

    // Always perform a backend code exchange from the callback when a code is present
    if (!code) {
      setStatus('no-code');
      setMessage('No authorization code found in callback URL.');
      return;
    }

    const endpoint = `${cfg.apiOrigin}${cfg.OAUTH_EXCHANGE_PATH}`;
    const payload = { code, state, redirect, url: current.url };
    // eslint-disable-next-line no-console
    console.log('[OIDC] Calling backend exchange from callback', { endpoint, params: { ...payload, code: '***', state: state ? '***' : undefined } });

    setStatus('exchanging');

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
          throw new Error(`Exchange failed: ${res.status} ${res.statusText} ${text?.slice(0, 200)}`);
        }
        // eslint-disable-next-line no-console
        console.log('[OIDC] Exchange success. Response (masked):', maskSensitive(json || { text }));
        return { res, json };
      })
      .then(() => {
        // Do not verify via Permission; set session flag client-side and redirect
        try { window.localStorage.setItem('sessionActive', 'true'); } catch {}
        setStatus('done');
        setTimeout(() => {
          const finalRedirect = redirect || '/';
          window.location.replace(finalRedirect);
        }, 250);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('[OIDC] Exchange error:', err);
        setStatus('error');
        setMessage(err?.message || 'Unknown error during token exchange');
      });
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
