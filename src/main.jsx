import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.scss'
import history from './utils/history'
import { Auth0Provider } from '@auth0/auth0-react'
import { getConfig } from './config.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { ConsoleSpanExporter, SimpleSpanProcessor, TracerConfig, WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { Resource } from '@opentelemetry/resources';

registerInstrumentations({
    instrumentations: [
        // getWebAutoInstrumentations initializes all the package.
        // it's possible to configure each instrumentation if needed.
        getWebAutoInstrumentations({
            '@opentelemetry/instrumentation-fetch': {
                // config can be added here for example
                // we can initialize the instrumentation only for prod
                // enabled: import.meta.env.PROD,
            },
        }),
    ],
});


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
  cacheLocation: 'localstorage',
  resource: new Resource({
      [ATTR_SERVICE_NAME]: 'nexus-frontend',
  })

}

const provider = new WebTracerProvider(providerConfig);

// we will use ConsoleSpanExporter to check the generated spans in dev console
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

provider.register({
    contextManager: new ZoneContextManager(),
});

const exporter = new OTLPTraceExporter({
    url: 'http://http://prometheus-agent-agent-1:4318', // Replace with your collector endpoint
});


ReactDOM.createRoot(document.getElementById('root')).render(
  <Auth0Provider {...providerConfig}>
    <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools />
    </QueryClientProvider>
  </Auth0Provider>,
)
