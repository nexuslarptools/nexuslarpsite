import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import faroUploader from '@grafana/faro-rollup-plugin';
import { fileURLToPath } from 'url'

const FARO_APP_NAME = process.env.VITE_FARO_APP_NAME || 'nexusfrontend';
let FARO_APP_ID = "2466";

if (FARO_APP_NAME === "nexusdb_dev") {
    FARO_APP_ID = "3565";
}

// https://vitejs.dev/config/
export default defineConfig({
  root: './',
  publicDir: 'public',
  plugins: [
      react(),
    faroUploader({
      appName: FARO_APP_NAME,
      endpoint: "https://faro-api-prod-us-east-0.grafana.net/faro/api/v1",
      apiKey: "glc_eyJvIjoiMTA4ODg4OCIsIm4iOiJzdGFjay04OTQyMjktaW50ZWdyYXRpb24tZmFyb3ZpdGUiLCJrIjoiTFR2dzA2MzNBNzNZQkg0VUZtaVcxNjBuIiwibSI6eyJyIjoicHJvZC11cy1lYXN0LTAifX0=",
      appId: FARO_APP_ID,
      stackId: "894229",
      gzipContents: true,
      verbose: true,
    }),

  ],
  build: {
    minify: false
  },
  ...(process.env.NODE_ENV === 'development'
    ? {
      define: {
        global: {},
      },
    }
    : {}),
resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      ...(process.env.NODE_ENV !== 'development'
        ? {
          './runtimeConfig': './runtimeConfig.browser', //fix production build
        }
        : {}),
    },
  },
})

