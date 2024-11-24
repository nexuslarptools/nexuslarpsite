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
import { createReactRouterV6Options, getWebInstrumentations, initializeFaro, ReactIntegration, ReactRouterVersion } from '@grafana/faro-react';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';

initializeFaro({
    url: 'https://faro-collector-prod-us-east-0.grafana.net/collect/a191de8879d808dea3cbcdc718cb9c2c',
    app: {
        name: 'nexusfrontend',
        version: '1.0.0',
        environment: 'production'
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
