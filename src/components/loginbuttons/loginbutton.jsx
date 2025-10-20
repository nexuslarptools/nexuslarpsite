import './button.scss'
import { getConfig } from '../../config'

function buildAuthorizeUrl() {
  const cfg = getConfig();
  const endpoint = cfg.OIDC_AUTHORIZATION_ENDPOINT;
  const clientId = cfg.OIDC_CLIENT_ID;
  const redirectUri = cfg.OIDC_REDIRECT_URI || `${window.location.origin}/oauth2/callback`;
  const scope = cfg.OIDC_SCOPE || 'openid profile email';
  const audience = cfg.audience;

  if (!endpoint || !clientId) return null;

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope,
  });
  if (audience) params.set('audience', audience);

  const url = `${endpoint}?${params.toString()}`;
  // Log without leaking full URL if undesired
  // eslint-disable-next-line no-console
  console.log('[Auth] Redirecting to authorization endpoint with params:', {
    endpoint,
    params: {
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope,
      ...(audience ? { audience } : {}),
    },
  });
  return url;
}

const LoginButton = () => {
  const onClick = () => {
    const cfg = getConfig();
    const directUrl = buildAuthorizeUrl();
    if (directUrl) {
      window.location.assign(directUrl);
      return;
    }
    // Fallback: hit backend exchange path to let BFF/middleware drive auth
    const fallback = `${cfg.apiOrigin}${cfg.OAUTH_EXCHANGE_PATH}`;
    // eslint-disable-next-line no-console
    console.log('[Auth] Using fallback login path via backend exchange path:', { endpoint: fallback });
    window.location.assign(fallback);
  };

  return <button className="button-basic" onClick={onClick}>Log In</button>
}

export default LoginButton
