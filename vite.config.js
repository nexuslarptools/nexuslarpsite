import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import faroUploader from '@grafana/faro-rollup-plugin';



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
  }
})

