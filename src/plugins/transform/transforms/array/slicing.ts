/**
 * Transform Plugin - Array Slicing Transforms
 * @module plugins/transform/transforms/array/slicing
 */

import type { SameTypeTransformer } from '../../types';

/**
 * Take first n elements
 */
export function take<T>(n: number): SameTypeTransformer<T[]> {
  return (value: T[]) => value.slice(0, n);
}

/**
 * Drop first n elements
 */
export function drop<T>(n: number): SameTypeTransformer<T[]> {
  return (value: T[]) => value.slice(n);
}

/**
 * Take last n elements
 */
export function takeLast<T>(n: number): SameTypeTransformer<T[]> {
  return (value: T[]) => value.slice(-n);
}

/**
 * Drop last n elements
 */
export function dropLast<T>(n: number): SameTypeTransformer<T[]> {
  return (value: T[]) => value.slice(0, -n);
}

/**
 * Slice array
 */
export function slice<T>(start: number, end?: number): SameTypeTransformer<T[]> {
  return (value: T[]) => value.slice(start, end);
}
