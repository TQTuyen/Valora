/**
 * Transform Plugin - String Replacement Transforms
 * @module plugins/transform/transforms/string/replacement
 */

import type { SameTypeTransformer } from '../../types';

/**
 * Replace substring or pattern
 */
export function replace(search: string | RegExp, replacement: string): SameTypeTransformer<string> {
  return (value: string) => value.replace(search, replacement);
}

/**
 * Replace all occurrences of substring
 */
export function replaceAll(search: string, replacement: string): SameTypeTransformer<string> {
  return (value: string) => value.split(search).join(replacement);
}
