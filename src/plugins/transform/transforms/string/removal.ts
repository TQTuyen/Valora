/**
 * Transform Plugin - String Removal Transforms
 * @module plugins/transform/transforms/string/removal
 */

import type { SameTypeTransformer } from '../../types';

/**
 * Remove all whitespace
 */
export const removeWhitespace: SameTypeTransformer<string> = (value: string) => {
  return value.replace(/\s+/g, '');
};

/**
 * Normalize whitespace (collapse multiple spaces to single)
 */
export const normalizeWhitespace: SameTypeTransformer<string> = (value: string) => {
  return value.trim().replace(/\s+/g, ' ');
};

/**
 * Remove non-alphanumeric characters
 */
export const removeNonAlphanumeric: SameTypeTransformer<string> = (value: string) => {
  return value.replace(/[^a-zA-Z0-9]/g, '');
};
