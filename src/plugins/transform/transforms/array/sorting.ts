/**
 * Transform Plugin - Array Sorting Transforms
 * @module plugins/transform/transforms/array/sorting
 */

import type { SameTypeTransformer } from '../../types';

/**
 * Sort array
 */
export function sort<T>(compareFn?: (a: T, b: T) => number): SameTypeTransformer<T[]> {
  return (value: T[]) => [...value].sort(compareFn);
}

/**
 * Sort by key
 */
export function sortBy<T>(key: keyof T, descending = false): SameTypeTransformer<T[]> {
  return (value: T[]) => {
    return [...value].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (aVal < bVal) return descending ? 1 : -1;
      if (aVal > bVal) return descending ? -1 : 1;
      return 0;
    });
  };
}

/**
 * Reverse array
 */
export const reverse: SameTypeTransformer<unknown[]> = <T>(value: T[]) => [...value].reverse();

/**
 * Shuffle array (Fisher-Yates algorithm)
 */
export const shuffle: SameTypeTransformer<unknown[]> = <T>(value: T[]): T[] => {
  const result = [...value];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i] as T;
    result[i] = result[j] as T;
    result[j] = temp;
  }
  return result;
};
