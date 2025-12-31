/**
 * Transform Plugin - Array Mapping Transforms
 * @module plugins/transform/transforms/array/mapping
 */

import type { Transformer } from '../../types';

/**
 * Map each element
 */
export function map<T, U>(fn: (item: T, index: number) => U): Transformer<T[], U[]> {
  return (value: T[]) => value.map(fn);
}

/**
 * Flat map each element
 */
export function flatMap<T, U>(fn: (item: T, index: number) => U[]): Transformer<T[], U[]> {
  return (value: T[]) => value.flatMap(fn);
}
