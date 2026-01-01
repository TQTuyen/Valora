/**
 * Transform Plugin - Global Singleton Instance
 * @module plugins/transform/global
 */

import { createTransformPlugin } from './plugin';

import type { TransformConfig } from './config';
import type { TransformPlugin } from './plugin';

/**
 * Global transform plugin instance
 */
let globalInstance: TransformPlugin | null = null;

/**
 * Get the global transform plugin instance
 * Creates a new instance if one doesn't exist
 */
export function getTransformPlugin(): TransformPlugin {
  globalInstance ??= createTransformPlugin();
  return globalInstance;
}

/**
 * Configure the global transform plugin
 * If an instance already exists, it will be replaced
 *
 * @param config - Transform plugin configuration
 * @returns The configured plugin instance
 */
export function configureTransform(config?: TransformConfig): TransformPlugin {
  globalInstance = createTransformPlugin(config);
  return globalInstance;
}

/**
 * Reset the global transform plugin instance
 * Useful for testing
 */
export function resetTransformPlugin(): void {
  globalInstance = null;
}

/**
 * Global transform plugin instance (lazy-initialized)
 * Use `getTransformPlugin()` instead for better control
 */
export const globalTransform = new Proxy({} as TransformPlugin, {
  get(_target, prop) {
    const instance = getTransformPlugin();
    const value = instance[prop as keyof TransformPlugin];
    return typeof value === 'function' ? value.bind(instance) : value;
  },
});
