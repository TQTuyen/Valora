/**
 * Transform Plugin - String Extraction Transforms
 * @module plugins/transform/transforms/string/extraction
 */

import type { SameTypeTransformer } from '../../types';

/**
 * Extract substring
 */
export function substring(start: number, end?: number): SameTypeTransformer<string> {
  return (value: string) => value.substring(start, end);
}

/**
 * Slice string
 */
export function slice(start: number, end?: number): SameTypeTransformer<string> {
  return (value: string) => value.slice(start, end);
}
