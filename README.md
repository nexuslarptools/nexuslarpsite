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
