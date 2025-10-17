import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import faroUploader from '@grafana/faro-rollup-plugin'
import { fileURLToPath } from 'url'

// Read Faro configuration from environment variables
const FARO_APP_NAME = process.env.VITE_FARO_APP_NAME || 'nexusfrontend'
const FARO_ENDPOINT = process.env.VITE_FARO_ENDPOINT || process.env.VITE_FARO_URL
const FARO_API_KEY = process.env.VITE_FARO_API_KEY
const FARO_APP_ID = process.env.VITE_FARO_APP_ID
const FARO_STACK_ID = process.env.VITE_FARO_STACK_ID

// Only enable source map upload when running a production build and all required vars are present
const enableFaroUploader = process.env.NODE_ENV === 'production'
  && !!FARO_ENDPOINT && !!FARO_API_KEY && !!FARO_APP_ID && !!FARO_STACK_ID

// https://vitejs.dev/config/
export default defineConfig({
  root: './',
  publicDir: 'public',
  plugins: [
    react(),
    ...(enableFaroUploader
      ? [
          faroUploader({
            appName: FARO_APP_NAME,
            endpoint: FARO_ENDPOINT,
            apiKey: FARO_API_KEY,
            appId: FARO_APP_ID,
            stackId: FARO_STACK_ID,
            gzipContents: true,
            verbose: true,
          }),
        ]
      : []),
  ],
  build: {
    minify: false,
    sourcemap: true,
  },
  css: {
    devSourcemap: true,
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
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      ...(process.env.NODE_ENV !== 'development'
        ? {
            './runtimeConfig': './runtimeConfig.browser', //fix production build
          }
        : {}),
    },
  },
})

