import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import configJson from '../../auth_config.json'

// OAuth2 logout callback handler
// - Optionally calls backend to finalize logout (clear server session/cookies)
// - Clears any client-side tokens saved by the login callback
// - Redirects the user

const getQueryParams = (search) => {
  const params = new URLSearchParams(search)
  return {
    state: params.get('state'),
    error: params.get('error'),
    error_description: params.get('error_description'),
    redirect: params.get('redirect') || '/',
  }
}

const BACKEND_BASE = configJson.APILocation
// Allow backend path override via optional key; default to common path
const OAUTH_LOGOUT_PATH = configJson.OAUTH_LOGOUT_PATH || '/oauth2/logout'

function clearClientTokens() {
  try {
    sessionStorage.removeItem('oauth_access_token')
    sessionStorage.removeItem('oauth_refresh_token')
    sessionStorage.removeItem('oauth_id_token')
    sessionStorage.removeItem('oauth_user')
  } catch (e) {
    // ignore storage errors
  }
}

export default function OAuthLogout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state, error, error_description, redirect } = useMemo(() => getQueryParams(location.search), [location.search])

  const [status, setStatus] = useState('Signing you out…')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const run = async () => {
      if (error) {
        // On error from IdP, still clear local tokens
        clearClientTokens()
        setErrorMsg(error_description || error || 'Logout failed')
        setStatus('Logout encountered an error')
        return
      }

      try {
        setStatus('Contacting server to finalize logout…')
        // Notify backend to clear server session (if applicable)
        const resp = await fetch(`${BACKEND_BASE}${OAUTH_LOGOUT_PATH}` + (state ? `?state=${encodeURIComponent(state)}` : ''), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        })

        // Clear client tokens regardless of server response
        clearClientTokens()

        if (!resp.ok) {
          // Try to read response body for diagnostics but proceed with redirect
          const text = await resp.text().catch(() => '')
          // Keep a non-blocking message
          if (text) {
            setErrorMsg(`Server logout returned ${resp.status}: ${text}`)
          }
        }

        let target = redirect || '/'
        try {
          const data = await resp.json()
          if (data && typeof data === 'object' && data.redirect) {
            target = data.redirect
          }
        } catch (_) {
          // no json body
        }

        setStatus('Signed out. Redirecting…')
        navigate(target, { replace: true })
      } catch (e) {
        // On network or other errors, still clear and go home
        clearClientTokens()
        setErrorMsg(e.message || 'Unknown error contacting server')
        setStatus('Signed out locally. Redirecting…')
        navigate(redirect || '/', { replace: true })
      }
    }

    run()
  }, [state, error, error_description, redirect, navigate])

  return (
    <div style={{
      maxWidth: 560,
      margin: '64px auto',
      padding: 24,
      border: '1px solid #e0e0e0',
      borderRadius: 8,
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif'
    }}>
      <h2>Signing you out…</h2>
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
