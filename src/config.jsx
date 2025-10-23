import configJson from "./auth_config.json";

export function getConfig() {
  // Audience can come from config or env; ignore placeholder values
  const audienceFromConfig = configJson.audience && configJson.audience !== "YOUR_API_IDENTIFIER" ? configJson.audience : null;
  const audienceFromEnv = import.meta?.env?.VITE_AUTH0_AUDIENCE && import.meta.env.VITE_AUTH0_AUDIENCE !== "YOUR_API_IDENTIFIER" ? import.meta.env.VITE_AUTH0_AUDIENCE : null;
  const audience = audienceFromConfig || audienceFromEnv || null;

  const apiOrigin = configJson.APILocation || configJson.NAPILocation || window.location.origin;
  const appOrigin = configJson.appOrigin || window.location.origin;

  // OIDC direct authorization endpoint (optional; in a Traefik/BFF setup this may be omitted)

  // Middleware (Traefik forward-auth) endpoints; used when no direct OIDC endpoint is configured
  const oauthLoginPath = configJson.OAUTH_LOGIN_PATH || '/oauth2/login';
  const oauthMiddlewareLogoutPath = configJson.OAUTH_MIDDLEWARE_LOGOUT_PATH || '/oauth2/logout';
  // Redirect parameter name used by middleware (traefikoidc uses 'rd')
  const oauthMiddlewareRedirectParam = configJson.OAUTH_MIDDLEWARE_REDIRECT_PARAM || 'rd';

  return {
    apiOrigin,
    appOrigin,
    audience,
    OAUTH_EXCHANGE_PATH: configJson.OAUTH_EXCHANGE_PATH || '/api/v1/Auth/ExchangeCode',
    OAUTH_LOGOUT_PATH: configJson.OAUTH_LOGOUT_PATH || '/api/v1/Auth/Logout',
    OAUTH_LOGIN_PATH: oauthLoginPath,
    OAUTH_MIDDLEWARE_LOGOUT_PATH: oauthMiddlewareLogoutPath,
    OAUTH_MIDDLEWARE_REDIRECT_PARAM: oauthMiddlewareRedirectParam,
  };
}
