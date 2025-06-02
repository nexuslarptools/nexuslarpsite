export function getConfig() {
  // Get configuration from environment variables
  return {
    // API Configuration
    APILocation: import.meta.env.VITE_API_LOCATION || "https://decade.kylebrighton.com:6006",
    appOrigin: import.meta.env.VITE_APP_ORIGIN || "https://decade.kylebrighton.com:6006",

    // S3 Configuration
    bucketName: import.meta.env.VITE_BUCKET_NAME || "nexusdata",
    s3Info: {
      endpoint: import.meta.env.VITE_S3_ENDPOINT || "https://decade.kylebrighton.com:9000",
      region: import.meta.env.VITE_S3_REGION || "us-east-1",
      forcePathStyle: import.meta.env.VITE_S3_FORCE_PATH_STYLE === "true" || true
    },

    // Auth0 Configuration (for backward compatibility)
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    useRefreshTokens: true,
  };
}
