import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.scss'
import history from './utils/history'
import { Auth0Provider } from '@auth0/auth0-react'
import { getConfig } from './config.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.returnTo ? appState.returnTo : window.location.pathname
  )
}

const queryClient = new QueryClient()

const config = getConfig()

const providerConfig = {
  domain: config.domain,
  clientId: config.clientId,
  authorizationParams: {
    redirect_uri: window.location.origin,
    ...(config.audience ? { audience: config.audience } : null)
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
