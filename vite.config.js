import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import faroUploader from '@grafana/faro-rollup-plugin';
import { fileURLToPath } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
  root: './',
  publicDir: 'public',
  plugins: [
      react(),
    faroUploader({
      appName: "nexusfrontend",
      endpoint: "https://faro-collector-prod-us-east-0.grafana.net/collect/a191de8879d808dea3cbcdc718cb9c2c",
      apiKey: "glc_eyJvIjoiMTA4ODg4OCIsIm4iOiJzdGFjay04OTQyMjktaW50ZWdyYXRpb24tZmFyb3ZpdGUiLCJrIjoiTFR2dzA2MzNBNzNZQkg0VUZtaVcxNjBuIiwibSI6eyJyIjoicHJvZC11cy1lYXN0LTAifX0=",
      appId: "2466",
      gzipContents: true,
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

