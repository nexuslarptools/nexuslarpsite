import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import configJson from '../../auth_config.json'

// Minimal OAuth2 callback handler
// - Parses code/state from query params
// - Calls backend to exchange code for tokens
// - Stores access token and optional refresh token
// - Redirects the user

const getQueryParams = (search) => {
  const params = new URLSearchParams(search)
  return {
    code: params.get('code'),
    state: params.get('state'),
    error: params.get('error'),
    error_description: params.get('error_description'),
    redirect: params.get('redirect') || '/',
  }
}

const BACKEND_BASE = configJson.APILocation
// Allow backend path override via optional key; default to common path
const OAUTH_EXCHANGE_PATH = configJson.OAUTH_EXCHANGE_PATH || '/oauth2/callback'

export default function OAuthCallback() {
  const navigate = useNavigate()
  const location = useLocation()
  const { code, state, error, error_description, redirect } = useMemo(() => getQueryParams(location.search), [location.search])

  const [status, setStatus] = useState('Processing login...')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const run = async () => {
      if (error) {
        setErrorMsg(error_description || error || 'Authorization failed')
        setStatus('Login failed')
        return
      }
      if (!code) {
        setErrorMsg('Missing authorization code')
        setStatus('Login failed')
        return
      }

      try {
        setStatus('Exchanging code for tokens...')
        const resp = await fetch(`${BACKEND_BASE}${OAUTH_EXCHANGE_PATH}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // allow cookie-based sessions if backend sets them
          body: JSON.stringify({ code, state, redirectUri: window.location.origin + '/oauth2/callback' }),
        })

        if (!resp.ok) {
          const text = await resp.text()
          throw new Error(`Backend exchange failed (${resp.status}): ${text}`)
        }

        const data = await resp.json().catch(() => ({}))

        // Save tokens if provided
        if (data.access_token) {
          // Use sessionStorage by default to reduce persistence risk
          sessionStorage.setItem('oauth_access_token', data.access_token)
        }
        if (data.refresh_token) {
          sessionStorage.setItem('oauth_refresh_token', data.refresh_token)
        }

        // Optional: store id_token or user info if present
        if (data.id_token) {
          sessionStorage.setItem('oauth_id_token', data.id_token)
        }
        if (data.user) {
          sessionStorage.setItem('oauth_user', JSON.stringify(data.user))
        }

        setStatus('Login successful, redirecting...')

        // Prefer redirect from backend, else query param redirect, else root
        const target = data.redirect || redirect || '/'
        navigate(target, { replace: true })
      } catch (e) {
        setErrorMsg(e.message || 'Unknown error during code exchange')
        setStatus('Login failed')
      }
    }

    run()
  }, [code, state, error, error_description, redirect, navigate])

  return (
    <div style={{
      maxWidth: 560,
      margin: '64px auto',
      padding: 24,
      border: '1px solid #e0e0e0',
      borderRadius: 8,
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif'
    }}>
      <h2>Signing you in…</h2>
      <p>{status}</p>
      {errorMsg && (
        <>
          <div style={{ color: '#b00020', marginTop: 12 }}>
            {errorMsg}
          </div>
          <button style={{ marginTop: 12 }} onClick={() => navigate('/')}>Go to home</button>
        </>
      )}
    </div>
  )
}
