/**
 * Framework Adapters
 * @module adapters
 */

// Types
export type { IFrameworkAdapter, ValidatorMap } from './types';

// Base adapter class
export { BaseFrameworkAdapter } from './base-adapter';

// Utilities (exported as individual functions)
export {
  canSubmit,
  formatErrors,
  getFieldBindings,
  getFirstError,
  hasFieldErrors,
  shouldShowErrors,
} from './adapter-utils';

// Framework-specific adapters
export * as VueAdapter from './vue';
export * as ReactAdapter from './react';
// export * as SvelteAdapter from './svelte';
// export * as SolidAdapter from './solid';
export * as VanillaAdapter from './vanilla';
