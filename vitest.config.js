import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.js'],
    include: ['**/*.{test,spec}.{js,jsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/setup.js',
        '**/*.{test,spec}.{js,jsx}',
        'cypress/**',
        'dist/**'
      ],
      reportsDirectory: './coverage',
      all: true,
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
});
