/**
 * Transform Plugin - Object Merging Transforms
 * @module plugins/transform/transforms/object/merging
 */

import type { SameTypeTransformer } from '../../types';

/**
 * Merge with another object
 */
export function merge<T extends Record<string, unknown>>(
  source: Partial<T>,
): SameTypeTransformer<T> {
  return (value: T) => ({ ...value, ...source });
}

/**
 * Provide default values
 */
export function defaults<T extends Record<string, unknown>>(
  defaultValues: Partial<T>,
): SameTypeTransformer<T> {
  return (value: T) => ({ ...defaultValues, ...value });
}

/**
 * Deep merge objects
 */
export function deepMerge<T extends Record<string, unknown>>(
  source: Partial<T>,
): SameTypeTransformer<T> {
  return (value: T) => {
    const result = { ...value };

    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const sourceValue = source[key];
        const targetValue = result[key];

        if (
          sourceValue &&
          typeof sourceValue === 'object' &&
          !Array.isArray(sourceValue) &&
          targetValue &&
          typeof targetValue === 'object' &&
          !Array.isArray(targetValue)
        ) {
          result[key] = deepMerge(sourceValue as Record<string, unknown>)(
            targetValue as Record<string, unknown>,
          ) as T[Extract<keyof T, string>];
        } else {
          result[key] = sourceValue as T[Extract<keyof T, string>];
        }
      }
    }

    return result;
  };
}
