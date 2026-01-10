# Nexus LARP Site

## Authentication Overview

This frontend delegates authentication to the backend and supports forwardauth claims as the source of auth state.

- Login: the Log In button redirects the browser to /api/v1/login.
- After a successful login, the backend establishes an HttpOnly, Secure session cookie that the SPA uses for API calls.
- Primary auth check: the SPA calls GET `/api/v1/Users/Permission` (must be implemented on the backend) and expects the response to include forwardauth/JWT claims (either as the response body or under a `claims` property).

Cookie-based session details:
- The backend issues HttpOnly, Secure cookies with the prefix `_oidc_raczylo` that represent the authenticated session and authorization context.
- Because the cookies are HttpOnly and Secure, JavaScript cannot read them via document.cookie. The SPA never inspects cookies; it simply calls the permission endpoint and interprets the result.
- All API requests include `credentials: 'include'` so the browser will send these cookies automatically.

Pre-auth network gating:
- No backend API calls are made before the user completes login in middleware/BFF mode. The app gates queries using an `enabled` flag and AuthLevelInfo.
- If you author a new data hook or component, pass `{ enabled: isAuthenticated }` to the shared hooks (useGetData, useGetDataWithStale, useGetDataWitPage) or accept an `options.enabled` parameter in custom hooks and skip side effects when false.
- Utilities like `getUserData` now accept `options.enabled` and image hooks (`useImgQuery`, `useImgBucketQuery`, `usePresignedImgQuery`) also accept `options.enabled` to avoid pre-auth network calls.

How is `isAuthenticated` derived?
- The SPA does not read cookies or request headers. It calls `/api/v1/Users/Permission` with `credentials: 'include'` and maps roles/groups in the returned claims to a numeric auth level:
  - Groups/Roles are the same as the auth levels (case-insensitive). Mapping: wizard → Wizard (6), headgm → HeadGM (5), secondgm → SecondGM (4), approver → Approver (3), writer → Writer (2), reader → Reader (1).
  - Optionally, a direct numeric `authLevel` claim (or `x-auth-level`) may be used if present (> 0).
  - For backwards compatibility, if the endpoint returns a legacy `AuthLevel` string instead of claims, it will still be mapped to the numeric level.
- There is no OAuth callback page in BFF mode. The frontend does not process tokens; the backend handles the full flow and sets cookies.

### Redirect behavior and `/login`

- All routes except `/login` are protected by `AuthenticationGuard`.
- While the app is determining auth state (`authLevel === 0`), guarded routes render a spinner and do not navigate.
- Once loading completes, unauthenticated users are redirected to `/login`. The guard preserves the original destination in `location.state.from` so the app can return there after login.
- The `/login` route stores the intended destination in `sessionStorage` (`returnTo`). If the user is already authenticated and lands on `/login`, they are immediately returned to that stored destination (or `/`).
- After a successful backend login, the first guarded render will consume `sessionStorage.returnTo` and navigate once to the intended path, then clear it.

## Environment Configuration

This app uses Vite environment variables. Create a .env (or .env.local) file with variables as needed:

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
- TAILSCALE_AUTHKEY (optional; for Tailscale SSH access)
- TAILSCALE_OAUTH_CLIENT_ID (optional; for Tailscale SSH access)
- TAILSCALE_OAUTH_CLIENT_SECRET (optional; for Tailscale SSH access)
- TAILSCALE_TAGS (optional; required if using OAuth client credentials)

Examples:
- Ensure BuildKit is enabled (Docker Desktop enables it by default). Otherwise, set the env var for the build command.
- Create small files containing only the secret values, e.g. secrets/AUTH0_DOMAIN.txt, etc.
- Build the image, passing the secrets you actually use.
- **Note on Tailscale**: Tailscale credentials can be passed as `--build-arg` to be baked into the image for "zero-config" startup, or passed at runtime via environment variables (recommended for production).

Windows PowerShell:
$env:DOCKER_BUILDKIT=1; docker build \
  --secret id=VITE_AUTH0_DOMAIN,src=secrets/AUTH0_DOMAIN.txt \
  --secret id=VITE_AUTH0_CLIENT_ID,src=secrets/AUTH0_CLIENT_ID.txt \
  --secret id=VITE_AUTH0_AUDIENCE,src=secrets/AUTH0_AUDIENCE.txt \
  --secret id=VITE_FARO_URL,src=secrets/FARO_URL.txt \
  --secret id=VITE_MINIO_CREDS_ACCESS_KEY,src=secrets/MINIO_ACCESS_KEY.txt \
  --secret id=VITE_MINIO_CREDS_SECRET_KEY,src=secrets/MINIO_SECRET_KEY.txt \
  --build-arg TAILSCALE_AUTHKEY="your-auth-key" \
  --build-arg TAILSCALE_OAUTH_CLIENT_ID="your-client-id" \
  --build-arg TAILSCALE_OAUTH_CLIENT_SECRET="your-client-secret" \
  --build-arg TAILSCALE_TAGS="tag:your-tag" \
  -t nexuslarpsite:latest .

Linux/macOS:
DOCKER_BUILDKIT=1 docker build \
  --secret id=VITE_AUTH0_DOMAIN,src=secrets/AUTH0_DOMAIN.txt \
  --secret id=VITE_AUTH0_CLIENT_ID,src=secrets/AUTH0_CLIENT_ID.txt \
  --secret id=VITE_AUTH0_AUDIENCE,src=secrets/AUTH0_AUDIENCE.txt \
  --secret id=VITE_FARO_URL,src=secrets/FARO_URL.txt \
  --secret id=VITE_MINIO_CREDS_ACCESS_KEY,src=secrets/MINIO_ACCESS_KEY.txt \
  --secret id=VITE_MINIO_CREDS_SECRET_KEY,src=secrets/MINIO_SECRET_KEY.txt \
  --build-arg TAILSCALE_AUTHKEY="your-auth-key" \
  --build-arg TAILSCALE_OAUTH_CLIENT_ID="your-client-id" \
  --build-arg TAILSCALE_OAUTH_CLIENT_SECRET="your-client-secret" \
  --build-arg TAILSCALE_TAGS="tag:your-tag" \
  -t nexuslarpsite:latest .

Notes:
- Provide only the secrets you need; missing optional secrets fall back to defaults or disable related features (e.g., Faro).
- Vite variables (passed via `--secret`) are baked into the static JS files during build but are not persisted in the Docker image metadata.
- Tailscale credentials (passed via `--build-arg`) are persisted as environment variables in the image to allow for zero-config startup.
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
- TAILSCALE_OAUTH_CLIENT_ID (optional)
- TAILSCALE_OAUTH_CLIENT_SECRET (optional)

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
  TAILSCALE_AUTHKEY=${{ secrets.TAILSCALE_AUTHKEY }}
  TAILSCALE_OAUTH_CLIENT_ID=${{ secrets.TAILSCALE_OAUTH_CLIENT_ID }}
  TAILSCALE_OAUTH_CLIENT_SECRET=${{ secrets.TAILSCALE_OAUTH_CLIENT_SECRET }}
  TAILSCALE_TAGS=${{ secrets.TAILSCALE_TAGS }}

Notes:
- Provide only the secrets you need; optional ones may be omitted.
- Tailscale credentials passed to the build-push action will be baked into the image.
- If you prefer to provide Tailscale credentials only at runtime, do not set them in the GitHub Action secrets list and instead pass them to the container when starting it.
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
