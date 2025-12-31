/**
 * Transform Plugin - Configuration
 * @module plugins/transform/config
 */

import type { NamedTransformer, TransformOptions } from './types';

/**
 * Transform plugin configuration
 */
export interface TransformConfig {
  /**
   * Default transform options
   */
  defaultOptions?: TransformOptions;

  /**
   * Custom transforms to register on initialization
   * Key is the transform name, value is the transformer function or named transformer
   */
  customTransforms?: Record<string, NamedTransformer>;

  /**
   * Whether to load built-in transforms
   * @default true
   */
  loadBuiltIns?: boolean;

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;
}

/**
 * Default transform plugin configuration
 */
export const DEFAULT_TRANSFORM_CONFIG: Required<Omit<TransformConfig, 'customTransforms'>> = {
  defaultOptions: {
    throwOnError: false,
  },
  loadBuiltIns: true,
  debug: false,
};

/**
 * Merge user config with defaults
 */
export function mergeConfig(userConfig?: TransformConfig): Required<TransformConfig> {
  return {
    ...DEFAULT_TRANSFORM_CONFIG,
    customTransforms: {},
    ...userConfig,
    defaultOptions: {
      ...DEFAULT_TRANSFORM_CONFIG.defaultOptions,
      ...userConfig?.defaultOptions,
    },
  };
}
