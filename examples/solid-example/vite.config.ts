import path from 'node:path';

import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
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
      { find: '@utils', replacement: path.resolve(__dirname, '../../src/utils') },
      { find: '@utils/*', replacement: path.resolve(__dirname, '../../src/utils') + '/*' },
      { find: '@plugins', replacement: path.resolve(__dirname, '../../src/plugins') },
      { find: '@plugins/*', replacement: path.resolve(__dirname, '../../src/plugins') + '/*' },
      { find: '@schema', replacement: path.resolve(__dirname, '../../src/schema') },
      { find: '@schema/*', replacement: path.resolve(__dirname, '../../src/schema') + '/*' },
      { find: '@decorators', replacement: path.resolve(__dirname, '../../src/decorators') },
      {
        find: '@decorators/*',
        replacement: path.resolve(__dirname, '../../src/decorators') + '/*',
      },
      { find: '#types', replacement: path.resolve(__dirname, '../../src/types') },
      { find: '#types/*', replacement: path.resolve(__dirname, '../../src/types') + '/*' },
    ],
  },
  build: {
    target: 'esnext',
  },
});
