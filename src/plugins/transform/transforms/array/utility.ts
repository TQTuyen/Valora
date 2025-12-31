/**
 * Transform Plugin - Array Utility Transforms
 * @module plugins/transform/transforms/array/utility
 */

import type { Transformer } from '../../types';

/**
 * Find element by predicate
 */
export function find<T>(predicate: (item: T, index: number) => boolean): Transformer<T[], T | undefined> {
  return (value: T[]) => value.find(predicate);
}

/**
 * Find index by predicate
 */
export function findIndex<T>(predicate: (item: T, index: number) => boolean): Transformer<T[], number> {
  return (value: T[]) => value.findIndex(predicate);
}

/**
 * Check if includes element
 */
export function includes<T>(item: T): Transformer<T[], boolean> {
  return (value: T[]) => value.includes(item);
}

/**
 * Get array length
 */
export const length: Transformer<unknown[], number> = (value: unknown[]) => value.length;

/**
 * Zip arrays together
 */
export function zip(...arrays: unknown[][]): Transformer<unknown[], unknown[][]> {
  return (value: unknown[]) => {
    const all = [value, ...arrays];
    const maxLength = Math.max(...all.map((arr) => arr.length));
    const result: unknown[][] = [];

    for (let i = 0; i < maxLength; i++) {
      result.push(all.map((arr) => arr[i]));
    }

    return result;
  };
}

/**
 * Group by key
 */
export function groupBy<T extends Record<string, unknown>>(
  key: keyof T,
): Transformer<T[], Record<string, T[]>> {
  return (value: T[]) => {
    return value.reduce<Record<string, T[]>>((acc, item) => {
      const groupKey = String(item[key]);
      acc[groupKey] ??= [];
      acc[groupKey].push(item);
      return acc;
    }, {});
  };
}
