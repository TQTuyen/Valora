/**
 * Transform Plugin - Array Aggregation Transforms
 * @module plugins/transform/transforms/array/aggregation
 */

import type { Transformer } from '../../types';

/**
 * Get first element
 */
export const first: Transformer<unknown[]> = <T>(value: T[]) => value[0];

/**
 * Get last element
 */
export const last: Transformer<unknown[]> = <T>(value: T[]) => value[value.length - 1];

/**
 * Sum numeric array
 */
export const sum: Transformer<number[], number> = (value: number[]) =>
  value.reduce((acc, n) => acc + n, 0);

/**
 * Get average of numeric array
 */
export const average: Transformer<number[], number> = (value: number[]) => {
  if (value.length === 0) return 0;
  return sum(value) / value.length;
};

/**
 * Get minimum value
 */
export const minValue: Transformer<number[], number> = (value: number[]) => Math.min(...value);

/**
 * Get maximum value
 */
export const maxValue: Transformer<number[], number> = (value: number[]) => Math.max(...value);
