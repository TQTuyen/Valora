import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'valora': resolve(__dirname, '../../dist'),
      'valora/adapters/react': resolve(__dirname, '../../dist/adapters/react'),
      '@validators': resolve(__dirname, '../../dist/validators'),
    },
  },
});
