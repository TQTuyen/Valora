import { resolve } from 'path';

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: false,
      include: ['src/**/*'],
      exclude: ['**/*.test.ts', '**/*.spec.ts'],
    }),
  ],
  build: {
    lib: {
      entry: {
        // Main entry
        index: resolve(__dirname, 'src/index.ts'),

        // Core
        'core/index': resolve(__dirname, 'src/core/index.ts'),

        // Notification
        'notification/index': resolve(__dirname, 'src/notification/index.ts'),

        // Validators - main
        'validators/index': resolve(__dirname, 'src/validators/index.ts'),

        // Validators - by category (tree-shakeable)
        'validators/string/index': resolve(__dirname, 'src/validators/string/index.ts'),
        'validators/number/index': resolve(__dirname, 'src/validators/number/index.ts'),
        'validators/date/index': resolve(__dirname, 'src/validators/date/index.ts'),
        'validators/array/index': resolve(__dirname, 'src/validators/array/index.ts'),
        'validators/object/index': resolve(__dirname, 'src/validators/object/index.ts'),
        'validators/boolean/index': resolve(__dirname, 'src/validators/boolean/index.ts'),
        'validators/file/index': resolve(__dirname, 'src/validators/file/index.ts'),
        'validators/business/index': resolve(__dirname, 'src/validators/business/index.ts'),
        'validators/async/index': resolve(__dirname, 'src/validators/async/index.ts'),
        'validators/logic/index': resolve(__dirname, 'src/validators/logic/index.ts'),
        'validators/comparison/index': resolve(__dirname, 'src/validators/comparison/index.ts'),
        'validators/common/index': resolve(__dirname, 'src/validators/common/index.ts'),

        // Adapters
        'adapters/index': resolve(__dirname, 'src/adapters/index.ts'),
        'adapters/react/index': resolve(__dirname, 'src/adapters/react/index.ts'),
        'adapters/vue/index': resolve(__dirname, 'src/adapters/vue/index.ts'),
        'adapters/svelte/index': resolve(__dirname, 'src/adapters/svelte/index.ts'),
        'adapters/solid/index': resolve(__dirname, 'src/adapters/solid/index.ts'),
        'adapters/vanilla/index': resolve(__dirname, 'src/adapters/vanilla/index.ts'),

        // Plugins
        'plugins/index': resolve(__dirname, 'src/plugins/index.ts'),
        'plugins/i18n/index': resolve(__dirname, 'src/plugins/i18n/index.ts'),
        'plugins/logger/index': resolve(__dirname, 'src/plugins/logger/index.ts'),
        'plugins/cache/index': resolve(__dirname, 'src/plugins/cache/index.ts'),
        'plugins/transform/index': resolve(__dirname, 'src/plugins/transform/index.ts'),
        'plugins/devtools/index': resolve(__dirname, 'src/plugins/devtools/index.ts'),

        // Schema
        'schema/index': resolve(__dirname, 'src/schema/index.ts'),

        // Utils
        'utils/index': resolve(__dirname, 'src/utils/index.ts'),

        // Types
        'types/index': resolve(__dirname, 'src/types/index.ts'),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'vue', 'svelte', 'solid-js'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        exports: 'named',
      },
    },
    target: 'esnext',
    minify: false,
    sourcemap: true,
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@core': resolve(__dirname, 'src/core'),
      '@validators': resolve(__dirname, 'src/validators'),
      '@notification': resolve(__dirname, 'src/notification'),
      '@adapters': resolve(__dirname, 'src/adapters'),
      '@plugins': resolve(__dirname, 'src/plugins'),
      '@schema': resolve(__dirname, 'src/schema'),
      '@utils': resolve(__dirname, 'src/utils'),
      '#types': resolve(__dirname, 'src/types'),
    },
  },
});
