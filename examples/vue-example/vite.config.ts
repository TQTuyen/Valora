import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Vue app aliases
      '@': resolve(__dirname, './src'),
      
      // Valora framework aliases
      'valora': resolve(__dirname, '../../src'),
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
  },
});
