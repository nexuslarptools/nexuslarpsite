FROM node:20-alpine AS build

# Build-time arguments (mapped to Vite env vars)
ARG REACT_APP_AUTH0_DOMAIN
ARG REACT_APP_AUTH0_CLIENT_ID
ARG REACT_APP_AUTH0_AUDIENCE
ARG REACT_APP_MINIO_CREDS_ACCESS_KEY
ARG REACT_APP_MINIO_CREDS_SECRET_KEY
ARG REACT_APP_FARO_URL
ARG REACT_APP_FARO_NAME
ARG REACT_APP_FARO_VERSION
ARG REACT_APP_FARO_ENV

# Scope env vars to the build stage only
ENV VITE_AUTH0_DOMAIN=${REACT_APP_AUTH0_DOMAIN} \
    VITE_AUTH0_CLIENT_ID=${REACT_APP_AUTH0_CLIENT_ID} \
    VITE_AUTH0_AUDIENCE=${REACT_APP_AUTH0_AUDIENCE} \
    VITE_MINIO_CREDS_ACCESS_KEY=${REACT_APP_MINIO_CREDS_ACCESS_KEY} \
    VITE_MINIO_CREDS_SECRET_KEY=${REACT_APP_MINIO_CREDS_SECRET_KEY} \
    VITE_FARO_URL=${REACT_APP_FARO_URL} \
    VITE_FARO_APP_NAME=${REACT_APP_FARO_NAME} \
    VITE_FARO_APP_VERSION=${REACT_APP_FARO_VERSION} \
    VITE_FARO_ENV=${REACT_APP_FARO_ENV}

WORKDIR /app

# Install dependencies using clean and reproducible installs
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# Copy the rest of the source and build
COPY . .
RUN npm run build

# Use a small, pinned NGINX image for serving static files
FROM nginx:1.27-alpine

# Copy build output and NGINX config
COPY --from=build /app/dist /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80