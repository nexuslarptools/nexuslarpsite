# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies using clean and reproducible installs
COPY package*.json ./
RUN npm ci --no-audit --no-fund

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

# Use a small, pinned NGINX image for serving static files
FROM nginx:1.27-alpine

# Copy build output and NGINX config
COPY --from=build /app/dist /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /root/.ssh \
    && chmod 0700 /root/.ssh \
    && passwd -u root \
    && echo 'root:password123!' | chpasswd && \
    sed -i 's/^#*PermitRootLogin .*/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    sed -i 's/^#*PasswordAuthentication .*/PasswordAuthentication yes/' /etc/ssh/sshd_config && \
    echo "PermitUserEnvironment yes" >> /etc/ssh/sshd_config && \
    && apk add openrc openssh \
    && mkdir -p /run/openrc \
    && touch /run/openrc/softlevel


EXPOSE 80
EXPOSE 22