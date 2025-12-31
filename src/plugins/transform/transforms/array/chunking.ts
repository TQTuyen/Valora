/**
 * Transform Plugin - Array Chunking Transforms
 * @module plugins/transform/transforms/array/chunking
 */

import type { Transformer } from '../../types';

/**
 * Split into chunks of specified size
 */
export function chunk<T>(size: number): Transformer<T[], T[][]> {
  return (value: T[]) => {
    const result: T[][] = [];
    for (let i = 0; i < value.length; i += size) {
      result.push(value.slice(i, i + size));
    }
    return result;
  };
}

/**
 * Split into n groups
 */
export function partition<T>(n: number): Transformer<T[], T[][]> {
  return (value: T[]) => {
    const size = Math.ceil(value.length / n);
    return chunk<T>(size)(value);
  };
}
