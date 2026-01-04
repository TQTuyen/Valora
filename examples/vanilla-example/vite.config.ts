import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, '../../src'),
      '@core': resolve(__dirname, '../../src/core'),
      '@validators': resolve(__dirname, '../../src/validators'),
      '@notification': resolve(__dirname, '../../src/notification'),
      '@adapters': resolve(__dirname, '../../src/adapters'),
      '@plugins': resolve(__dirname, '../../src/plugins'),
      '@schema': resolve(__dirname, '../../src/schema'),
      '@utils': resolve(__dirname, '../../src/utils'),
      '#types': resolve(__dirname, '../../src/types'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
