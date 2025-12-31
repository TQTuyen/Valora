/**
 * Transform Plugin - String Padding Transforms
 * @module plugins/transform/transforms/string/padding
 */

import type { SameTypeTransformer } from '../../types';

/**
 * Pad start to target length
 */
export function padStart(targetLength: number, padChar = ' '): SameTypeTransformer<string> {
  return (value: string) => value.padStart(targetLength, padChar);
}

/**
 * Pad end to target length
 */
export function padEnd(targetLength: number, padChar = ' '): SameTypeTransformer<string> {
  return (value: string) => value.padEnd(targetLength, padChar);
}
