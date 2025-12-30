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

// Framework-specific adapters (to be implemented)
// export * from './react';
// export * from './vue';
// export * from './svelte';
// export * from './solid';
// export * from './vanilla';
