# Nexus LARP Site

## Authentication Overview

This frontend can operate in two modes:
- Traefik OAuth middleware (recommended): The SPA delegates authentication to a generic OAuth/OIDC provider via Traefik forward-auth. Tokens are exchanged by the middleware, and the API is accessed using an HttpOnly session cookie. The SPA never stores tokens.
- Direct OIDC (legacy): The app can still build an authorization URL for a specific provider (e.g., Auth0) and rely on a backend exchange endpoint.

The mode is determined dynamically:
- If OIDC_AUTHORIZATION_ENDPOINT (and client ID) are provided in src/auth_config.json or env, the app uses Direct OIDC.
- Otherwise, it assumes Traefik middleware/BFF mode and uses the middleware login/logout endpoints.

Key config fields (src/auth_config.json):
- OAUTH_LOGIN_PATH (default: /oauth/login) — Traefik forward-auth login endpoint.
- OAUTH_MIDDLEWARE_LOGOUT_PATH (default: /oauth/logout) — Traefik forward-auth logout endpoint.
- OAUTH_MIDDLEWARE_REDIRECT_PARAM (default: rd) — Name of the return URL parameter used by the middleware (traefikoidc uses rd).
- OAUTH_EXCHANGE_PATH (default: /api/v1/Auth/ExchangeCode) — backend code exchange (legacy mode).
- OAUTH_LOGOUT_PATH (default: /api/v1/Auth/Logout) — backend logout (legacy mode).
- OIDC_AUTHORIZATION_ENDPOINT, OIDC_CLIENT_ID, OIDC_REDIRECT_URI, OIDC_SCOPE — when set, enables Direct OIDC mode.

The SPA verifies auth state via GET /api/v1/Users/Permission with credentials: 'include'.

## Environment Configuration

This app uses Vite environment variables. Create a .env (or .env.local) file with the following variables as needed:

Auth0 (legacy optional):
- VITE_AUTH0_DOMAIN=
- VITE_AUTH0_CLIENT_ID=
- VITE_AUTH0_AUDIENCE=

Grafana Faro (optional):
- VITE_FARO_URL= // e.g. https://faro-collector-.../collect/<token>
- VITE_FARO_APP_NAME= // default: nexusfrontend
- VITE_FARO_APP_VERSION= // default: 1.0.0
- VITE_FARO_ENV= // default: Vite MODE or 'production'

If VITE_FARO_URL is not set, Faro will not be initialized.

## Docker build (with individual secrets)

This project now uses Docker BuildKit secrets for each Vite variable individually (no ARG/ENV in the Dockerfile). Each secret contains only the value (no KEY= prefix). Pass any variables you need via multiple --secret flags.

Available secret IDs (match Vite vars in code):
- VITE_AUTH0_DOMAIN
- VITE_AUTH0_CLIENT_ID
- VITE_AUTH0_AUDIENCE
- VITE_FARO_URL (optional)
- VITE_FARO_APP_NAME (optional; default: nexusfrontend)
- VITE_FARO_APP_VERSION (optional; default: 1.0.0)
- VITE_FARO_ENV (optional; default: Vite MODE or 'production')
- VITE_MINIO_CREDS_ACCESS_KEY (if you use S3/MinIO features)
- VITE_MINIO_CREDS_SECRET_KEY (if you use S3/MinIO features)

Examples:
- Ensure BuildKit is enabled (Docker Desktop enables it by default). Otherwise, set the env var for the build command.
- Create small files containing only the secret values, e.g. secrets/AUTH0_DOMAIN.txt, etc.
- Build the image, passing the secrets you actually use:

Windows PowerShell:
$env:DOCKER_BUILDKIT=1; docker build \
  --secret id=VITE_AUTH0_DOMAIN,src=secrets/AUTH0_DOMAIN.txt \
  --secret id=VITE_AUTH0_CLIENT_ID,src=secrets/AUTH0_CLIENT_ID.txt \
  --secret id=VITE_AUTH0_AUDIENCE,src=secrets/AUTH0_AUDIENCE.txt \
  --secret id=VITE_FARO_URL,src=secrets/FARO_URL.txt \
  --secret id=VITE_MINIO_CREDS_ACCESS_KEY,src=secrets/MINIO_ACCESS_KEY.txt \
  --secret id=VITE_MINIO_CREDS_SECRET_KEY,src=secrets/MINIO_SECRET_KEY.txt \
  -t nexuslarpsite:latest .

Linux/macOS:
DOCKER_BUILDKIT=1 docker build \
  --secret id=VITE_AUTH0_DOMAIN,src=secrets/AUTH0_DOMAIN.txt \
  --secret id=VITE_AUTH0_CLIENT_ID,src=secrets/AUTH0_CLIENT_ID.txt \
  --secret id=VITE_AUTH0_AUDIENCE,src=secrets/AUTH0_AUDIENCE.txt \
  --secret id=VITE_FARO_URL,src=secrets/FARO_URL.txt \
  --secret id=VITE_MINIO_CREDS_ACCESS_KEY,src=secrets/MINIO_ACCESS_KEY.txt \
  --secret id=VITE_MINIO_CREDS_SECRET_KEY,src=secrets/MINIO_SECRET_KEY.txt \
  -t nexuslarpsite:latest .

Notes:
- Provide only the secrets you need; missing optional secrets fall back to defaults or disable related features (e.g., Faro).
- Secrets are only exposed to the build command and are not persisted in the final image or layer history.
- The previous single .env secret approach has been replaced by per-variable secrets.


## GitHub Actions (using GitHub Secrets)

If you build this project in GitHub Actions, configure repository-level Secrets with the same names as the Docker BuildKit secret IDs used in the Dockerfile. These are consumed only during the build and are not persisted in the image.

Add any of the following repository secrets as needed:
- VITE_AUTH0_DOMAIN
- VITE_AUTH0_CLIENT_ID
- VITE_AUTH0_AUDIENCE
- VITE_FARO_URL (optional)
- VITE_FARO_APP_NAME (optional; default: nexusfrontend)
- VITE_FARO_APP_VERSION (optional; default: 1.0.0)
- VITE_FARO_ENV (optional; default: Vite MODE or 'production')
- VITE_MINIO_CREDS_ACCESS_KEY (optional)
- VITE_MINIO_CREDS_SECRET_KEY (optional)

A sample workflow is provided at .github/workflows/docker-build.yml. It builds the image with BuildKit and maps GitHub Secrets to Docker Build secrets like so:

secrets:
  VITE_AUTH0_DOMAIN=${{ secrets.VITE_AUTH0_DOMAIN }}
  VITE_AUTH0_CLIENT_ID=${{ secrets.VITE_AUTH0_CLIENT_ID }}
  VITE_AUTH0_AUDIENCE=${{ secrets.VITE_AUTH0_AUDIENCE }}
  VITE_FARO_URL=${{ secrets.VITE_FARO_URL }}
  VITE_FARO_APP_NAME=${{ secrets.VITE_FARO_APP_NAME }}
  VITE_FARO_APP_VERSION=${{ secrets.VITE_FARO_APP_VERSION }}
  VITE_FARO_ENV=${{ secrets.VITE_FARO_ENV }}
  VITE_MINIO_CREDS_ACCESS_KEY=${{ secrets.VITE_MINIO_CREDS_ACCESS_KEY }}
  VITE_MINIO_CREDS_SECRET_KEY=${{ secrets.VITE_MINIO_CREDS_SECRET_KEY }}

Notes:
- Provide only the secrets you need; optional ones may be omitted.
- If you want to push the built image to a registry (e.g., GHCR), update the workflow to log in and set `push: true` with appropriate tags.


## SonarCloud

This repository is configured for SonarCloud analysis via GitHub Actions.

Setup steps:
- Create a project in SonarCloud and note your Organization key and Project key.
- In this GitHub repository settings, add the following secrets:
  - SONAR_TOKEN: A SonarCloud user token with Execute Analysis permission.
  - SONAR_ORGANIZATION: Your SonarCloud organization key (optional if you fill the properties file).
  - SONAR_PROJECT_KEY: Your SonarCloud project key (optional if you fill the properties file).
- Optionally, replace the placeholders in sonar-project.properties with your actual organization and project key. If left as placeholders, the workflow passes them via arguments from secrets.

The workflow .github/workflows/sonarcloud.yml runs on pushes and pull requests targeting main and development branches. For richer analysis (framework-aware rules), uncomment the Node setup, install, and build steps in the workflow to build the project before scanning.
