/**
 * Transform Plugin - Object Mapping Transforms
 * @module plugins/transform/transforms/object/mapping
 */

import type { SameTypeTransformer, Transformer } from '../../types';

/**
 * Map object values
 */
export function mapValues<T extends Record<string, unknown>, U>(
  fn: (value: T[keyof T], key: string) => U,
): Transformer<T, Record<string, U>> {
  return (value: T) => {
    const result: Record<string, U> = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        result[key] = fn(value[key], key);
      }
    }
    return result;
  };
}

/**
 * Map object keys
 */
export function mapKeys<T extends Record<string, unknown>>(
  fn: (key: string, value: T[keyof T]) => string,
): SameTypeTransformer<T> {
  return (value: T) => {
    const result: Record<string, unknown> = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        const newKey = fn(key, value[key]);
        result[newKey] = value[key];
      }
    }
    return result as T;
  };
}

/**
 * Filter object by predicate
 */
export function filterObject<T extends Record<string, unknown>>(
  fn: (value: T[keyof T], key: string) => boolean,
): Transformer<T, Partial<T>> {
  return (value: T) => {
    const result: Partial<T> = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        if (fn(value[key], key)) {
          result[key as keyof T] = value[key];
        }
      }
    }
    return result;
  };
}
