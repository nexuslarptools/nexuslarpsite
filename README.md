# Nexus LARP Site

This is the frontend application for the Nexus LARP site, built with React and Vite.

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory based on `.env.example`:
   ```
   cp .env.example .env
   ```
4. Fill in your environment variables in the `.env` file
5. Start the development server:
   ```
   npm run dev
   ```

## Environment Variables

The application uses environment variables for configuration. In development, these are loaded from a `.env` file. In production, they are set during the build process.

### Development

For local development, create a `.env` file in the root directory with the following variables:

```
# Auth0 Configuration
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=your-auth0-audience

# AWS/MinIO Configuration
VITE_MINIO_CREDS_ACCESS_KEY=your-minio-access-key
VITE_MINIO_CREDS_SECRET_KEY=your-minio-secret-key

# API Configuration
VITE_API_LOCATION=https://your-api-location
VITE_APP_ORIGIN=https://your-app-origin

# S3 Configuration
VITE_BUCKET_NAME=your-bucket-name
VITE_S3_ENDPOINT=https://your-s3-endpoint
VITE_S3_REGION=your-s3-region
VITE_S3_FORCE_PATH_STYLE=true

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your-emailjs-service-id
VITE_EMAILJS_TEMPLATE_ID=your-emailjs-template-id
VITE_EMAILJS_USER_ID=your-emailjs-user-id
```

### Production

For production builds, environment variables must be set during the build process. When using Docker, these are passed as build arguments:

```
docker build \
  --build-arg REACT_APP_AUTH0_DOMAIN=your-auth0-domain \
  --build-arg REACT_APP_AUTH0_CLIENT_ID=your-auth0-client-id \
  --build-arg REACT_APP_AUTH0_AUDIENCE=your-auth0-audience \
  --build-arg REACT_APP_MINIO_CREDS_ACCESS_KEY=your-minio-access-key \
  --build-arg REACT_APP_MINIO_CREDS_SECRET_KEY=your-minio-secret-key \
  --build-arg REACT_APP_API_LOCATION=https://your-api-location \
  --build-arg REACT_APP_APP_ORIGIN=https://your-app-origin \
  --build-arg REACT_APP_BUCKET_NAME=your-bucket-name \
  --build-arg REACT_APP_S3_ENDPOINT=https://your-s3-endpoint \
  --build-arg REACT_APP_S3_REGION=your-s3-region \
  --build-arg REACT_APP_S3_FORCE_PATH_STYLE=true \
  --build-arg REACT_APP_EMAILJS_SERVICE_ID=your-emailjs-service-id \
  --build-arg REACT_APP_EMAILJS_TEMPLATE_ID=your-emailjs-template-id \
  --build-arg REACT_APP_EMAILJS_USER_ID=your-emailjs-user-id \
  -t nexuslarpsite .
```

## Important Note About Environment Variables in Vite

Vite replaces environment variables at build time, not runtime. This means:

1. All environment variables must be available during the build process
2. Environment variables cannot be changed after the application is built
3. To update environment variables, you must rebuild the application

For more information, see the [Vite documentation on environment variables](https://vitejs.dev/guide/env-and-mode.html).
