import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.scss'
import history from './utils/history'
import { Auth0Provider } from '@auth0/auth0-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.returnTo ? appState.returnTo : window.location.pathname
  )
}

import { createRoutesFromChildren, matchRoutes, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { createReactRouterV6Options, getWebInstrumentations, initializeFaro, ReactIntegration } from '@grafana/faro-react';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';

// Read Faro configuration from environment variables
const FARO_URL = import.meta.env.VITE_FARO_URL;
const FARO_APP_NAME = import.meta.env.VITE_FARO_APP_NAME || 'nexusfrontend';
const FARO_APP_VERSION = import.meta.env.VITE_FARO_APP_VERSION || '1.0.0';
const FARO_ENV = import.meta.env.VITE_FARO_ENV || (import.meta.env.MODE || 'production');

// Initialize Faro only if a collector URL is provided
if (FARO_URL) {
  initializeFaro({
    url: FARO_URL,
    app: {
      name: FARO_APP_NAME,
      version: FARO_APP_VERSION,
      environment: FARO_ENV,
    },
    instrumentations: [
      // Mandatory, omits default instrumentations otherwise.
      ...getWebInstrumentations(),
      // Tracing package to get end-to-end visibility for HTTP requests.
      new TracingInstrumentation(),
      // React integration for React applications.
      new ReactIntegration({
        router: createReactRouterV6Options({
          createRoutesFromChildren,
          matchRoutes,
          Routes,
          useLocation,
          useNavigationType,
        }),
      }),
    ],
  });
} else {
  // eslint-disable-next-line no-console
  console.warn('Faro is not initialized: VITE_FARO_URL is not set');
}


const queryClient = new QueryClient()

const providerConfig = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
  },
  onRedirectCallback,
  useRefreshTokens: true,
  cacheLocation: 'localstorage'
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <Auth0Provider {...providerConfig}>
    <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools />
    </QueryClientProvider>
  </Auth0Provider>,
)
