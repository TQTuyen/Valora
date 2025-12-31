/**
 * Transform Plugin - Object Selection Transforms
 * @module plugins/transform/transforms/object/selection
 */

import type { Transformer } from '../../types';

/**
 * Pick specific keys from object
 */
export function pick<T extends Record<string, unknown>>(
  keys: string[],
): Transformer<T, Partial<T>> {
  return (value: T) => {
    const result: Partial<T> = {};
    for (const key of keys) {
      if (key in value) {
        result[key as keyof T] = value[key as keyof T];
      }
    }
    return result;
  };
}

/**
 * Omit specific keys from object
 */
export function omit<T extends Record<string, unknown>>(
  keys: string[],
): Transformer<T, Partial<T>> {
  return (value: T) => {
    const result = { ...value };
    const keysSet = new Set(keys);
    const filteredResult: Partial<T> = {};

    for (const key in result) {
      if (!keysSet.has(key)) {
        filteredResult[key] = result[key];
      }
    }

    return filteredResult;
  };
}
