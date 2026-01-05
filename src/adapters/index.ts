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
// export * from './vue';
// export * from './react';
// export * from './solid';
// export * from './svelte';
// export * from './vanilla';
