/**
 * Transform plugin
 * Provides transform orchestration and composition capabilities
 *
 * @example
 * ```typescript
 * import { getTransformPlugin, pipe } from 'valora/plugins/transform';
 *
 * // Get global instance
 * const plugin = getTransformPlugin();
 *
 * // Register custom transform
 * plugin.register('myapp.hash', (value: string) => `${value}_hashed`);
 *
 * // Apply transform
 * const result = plugin.apply('myapp.hash', 'secret'); // 'secret_hashed'
 * ```
 *
 * @module plugins/transform
 */

// Core types
export type {
  ITransformPlugin,
  NamedTransformer,
  SameTypeTransformer,
  Transformer,
  TransformerMeta,
  TransformOptions,
} from './types';

// Configuration
export type { TransformConfig } from './config';
export { DEFAULT_TRANSFORM_CONFIG, mergeConfig } from './config';

// Plugin class
export { createTransformPlugin,TransformPlugin } from './plugin';

// Global instance
export { configureTransform, getTransformPlugin, globalTransform,resetTransformPlugin } from './global';

// Composition utilities
export { attempt, chain, compose, debounce,memoize, pipe, sequence, tap, when } from './composers';

// Built-in transforms
export { arrayTransforms,dateTransforms, numberTransforms, objectTransforms, stringTransforms } from './transforms';
