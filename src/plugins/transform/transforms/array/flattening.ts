/**
 * Transform Plugin - Array Flattening Transforms
 * @module plugins/transform/transforms/array/flattening
 */

import type { SameTypeTransformer, Transformer } from '../../types';

/**
 * Flatten one level
 */
export const flatten: Transformer<unknown[][], unknown[]> = <T>(value: T[][]) => value.flat();

/**
 * Flatten deeply (all levels)
 */
export const flattenDeep: SameTypeTransformer<unknown[]> = <T>(value: T[]) => value.flat(Infinity);

/**
 * Flatten to specific depth
 */
export function flattenDepth<T>(depth: number): SameTypeTransformer<T[]> {
  return (value: T[]) => value.flat(depth) as T[];
}
