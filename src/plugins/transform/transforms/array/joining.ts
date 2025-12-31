/**
 * Transform Plugin - Array Joining Transforms
 * @module plugins/transform/transforms/array/joining
 */

import type { Transformer } from '../../types';

/**
 * Join array elements into string
 */
export function join(separator = ','): Transformer<unknown[], string> {
  return (value: unknown[]) => value.join(separator);
}
