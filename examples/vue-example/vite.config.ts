import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'valora': resolve(__dirname, '../../dist'),
      'valora/adapters/vue': resolve(__dirname, '../../dist/adapters/vue'),
      'valora/validators': resolve(__dirname, '../../dist/validators'),
    },
  },
  server: {
    port: 3000,
  },
});
