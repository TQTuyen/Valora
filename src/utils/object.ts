/**
 * Object Utilities
 * @module utils/object
 */

import { isObject } from './type-guards';

/**
 * Deep merge two objects
 * @param target - Target object
 * @param source - Source object to merge into target
 * @returns New merged object
 *
 * @example
 * deepMerge({ a: { b: 1 } }, { a: { c: 2 } })
 * // Returns: { a: { b: 1, c: 2 } }
 */
export function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = result[key];

      if (isObject(sourceValue) && isObject(targetValue)) {
        result[key] = deepMerge(
          targetValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>,
        ) as T[typeof key];
      } else if (sourceValue !== undefined) {
        result[key] = sourceValue as T[typeof key];
      }
    }
  }

  return result;
}

/**
 * Pick specific keys from an object
 * @param obj - Object to pick from
 * @param keys - Keys to pick
 * @returns New object with only picked keys
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Omit specific keys from an object
 * @param obj - Object to omit from
 * @param keys - Keys to omit
 * @returns New object without omitted keys
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const keySet = new Set<keyof T>(keys);
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keySet.has(key as keyof T)),
  ) as Omit<T, K>;
}
