# Nexus LARP Site

## Environment Configuration

This app uses Vite environment variables. Create a .env (or .env.local) file with the following variables as needed:

Auth0:
- VITE_AUTH0_DOMAIN=
- VITE_AUTH0_CLIENT_ID=
- VITE_AUTH0_AUDIENCE=

Grafana Faro (optional):
- VITE_FARO_URL= // e.g. https://faro-collector-.../collect/<token>
- VITE_FARO_APP_NAME= // default: nexusfrontend
- VITE_FARO_APP_VERSION= // default: 1.0.0
- VITE_FARO_ENV= // default: Vite MODE or 'production'

If VITE_FARO_URL is not set, Faro will not be initialized.
