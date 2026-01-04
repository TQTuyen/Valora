import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: [
      { find: 'valora', replacement: path.resolve(__dirname, '../../src') },
      { find: 'valora/*', replacement: path.resolve(__dirname, '../../src') + '/*' },
      { find: '@tqtos/valora', replacement: path.resolve(__dirname, '../../src') },
      { find: '@tqtos/valora/*', replacement: path.resolve(__dirname, '../../src') + '/*' },
      { find: '@adapters', replacement: path.resolve(__dirname, '../../src/adapters') },
      { find: '@adapters/*', replacement: path.resolve(__dirname, '../../src/adapters') + '/*' },
      { find: '@notification', replacement: path.resolve(__dirname, '../../src/notification') },
      {
        find: '@notification/*',
        replacement: path.resolve(__dirname, '../../src/notification') + '/*',
      },
      { find: '@validators', replacement: path.resolve(__dirname, '../../src/validators') },
      {
        find: '@validators/*',
        replacement: path.resolve(__dirname, '../../src/validators') + '/*',
      },
      { find: '@core', replacement: path.resolve(__dirname, '../../src/core') },
      { find: '@core/*', replacement: path.resolve(__dirname, '../../src/core') + '/*' },
      { find: '#types', replacement: path.resolve(__dirname, '../../src/types') },
      { find: '#types/*', replacement: path.resolve(__dirname, '../../src/types') + '/*' },
    ],
  },
});
