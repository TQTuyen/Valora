/**
 * Transform Plugin - Array Filtering Transforms
 * @module plugins/transform/transforms/array/filtering
 */

import type { SameTypeTransformer } from '../../types';

/**
 * Remove duplicate values
 */
export const unique: SameTypeTransformer<unknown[]> = <T>(value: T[]) => [...new Set(value)];

/**
 * Remove falsy values (null, undefined, false, 0, '')
 */
export const compact: SameTypeTransformer<unknown[]> = <T>(value: T[]) => value.filter(Boolean);

/**
 * Filter by predicate
 */
export function filter<T>(predicate: (item: T, index: number) => boolean): SameTypeTransformer<T[]> {
  return (value: T[]) => value.filter(predicate);
}

/**
 * Remove null and undefined values
 */
export const removeNullish: SameTypeTransformer<unknown[]> = <T>(value: T[]) =>
  value.filter((item) => item !== null && item !== undefined);
