/**
 * Transform Plugin - String Utility Transforms
 * @module plugins/transform/transforms/string/utility
 */

import type { SameTypeTransformer, Transformer } from '../../types';

/**
 * Reverse string
 */
export const reverse: SameTypeTransformer<string> = (value: string) => {
  return value.split('').reverse().join('');
};

/**
 * Repeat string n times
 */
export function repeat(count: number): SameTypeTransformer<string> {
  return (value: string) => value.repeat(count);
}

/**
 * Split string and return array
 */
export function split(separator: string | RegExp): Transformer<string, string[]> {
  return (value: string) => value.split(separator);
}
