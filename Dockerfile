# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies using clean and reproducible installs
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

# Copy the rest of the source
COPY . .

# Build with Vite env vars provided via individual Docker BuildKit secrets
# Each secret should contain only the value (no KEY= prefix). For example, the secret
# with id VITE_AUTH0_DOMAIN should contain only your Auth0 domain value.
# We load any provided secrets only for this RUN so they are not persisted in image layers.
RUN \
    --mount=type=secret,id=VITE_AUTH0_DOMAIN,target=/run/secrets/VITE_AUTH0_DOMAIN \
    --mount=type=secret,id=VITE_AUTH0_CLIENT_ID,target=/run/secrets/VITE_AUTH0_CLIENT_ID \
    --mount=type=secret,id=VITE_AUTH0_AUDIENCE,target=/run/secrets/VITE_AUTH0_AUDIENCE \
    --mount=type=secret,id=VITE_FARO_URL,target=/run/secrets/VITE_FARO_URL \
    --mount=type=secret,id=VITE_FARO_APP_NAME,target=/run/secrets/VITE_FARO_APP_NAME \
    --mount=type=secret,id=VITE_FARO_APP_VERSION,target=/run/secrets/VITE_FARO_APP_VERSION \
    --mount=type=secret,id=VITE_FARO_ENV,target=/run/secrets/VITE_FARO_ENV \
    --mount=type=secret,id=VITE_MINIO_CREDS_ACCESS_KEY,target=/run/secrets/VITE_MINIO_CREDS_ACCESS_KEY \
    --mount=type=secret,id=VITE_MINIO_CREDS_SECRET_KEY,target=/run/secrets/VITE_MINIO_CREDS_SECRET_KEY \
    sh -lc 'set -e; \
      for k in \
        VITE_AUTH0_DOMAIN \
        VITE_AUTH0_CLIENT_ID \
        VITE_AUTH0_AUDIENCE \
        VITE_FARO_URL \
        VITE_FARO_APP_NAME \
        VITE_FARO_APP_VERSION \
        VITE_FARO_ENV \
        VITE_MINIO_CREDS_ACCESS_KEY \
        VITE_MINIO_CREDS_SECRET_KEY; do \
        f="/run/secrets/$k"; \
        if [ -f "$f" ]; then \
          v=$(cat "$f"); \
          export "$k=$v"; \
        fi; \
      done; \
      npm run build'

# Use NGINX 1.29 (Debian Trixie based)
FROM nginx:1.29

# Install and configure Tailscale
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    iproute2 \
    bash \
    && curl -fsSL https://tailscale.com/install.sh | sh \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /var/lib/tailscale /var/run/tailscale \
    && touch /var/lib/tailscale/tailscaled.state

# Tailscale credentials can be provided at build time via build-args to be baked into the image,
# or provided at runtime via environment variables or Docker secrets.
ARG TAILSCALE_AUTHKEY
ARG TAILSCALE_OAUTH_CLIENT_ID
ARG TAILSCALE_OAUTH_CLIENT_SECRET
ARG TAILSCALE_TAGS

ENV TAILSCALE_AUTHKEY=$TAILSCALE_AUTHKEY
ENV TAILSCALE_OAUTH_CLIENT_ID=$TAILSCALE_OAUTH_CLIENT_ID
ENV TAILSCALE_OAUTH_CLIENT_SECRET=$TAILSCALE_OAUTH_CLIENT_SECRET
ENV TAILSCALE_TAGS=$TAILSCALE_TAGS

# Add a script to start Tailscale when the container starts
COPY --chmod=755 start-tailscale.sh /docker-entrypoint.d/40-start-tailscale.sh

# Copy NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output last as it changes most frequently
COPY --from=build /app/dist /usr/share/nginx/html/

EXPOSE 80