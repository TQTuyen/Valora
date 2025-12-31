/**
 * Transform Plugin - String Case Transforms
 * @module plugins/transform/transforms/string/case
 */

import type { SameTypeTransformer } from '../../types';

/**
 * Trim whitespace from both ends
 */
export const trim: SameTypeTransformer<string> = (value: string) => value.trim();

/**
 * Convert to lowercase
 */
export const toLowerCase: SameTypeTransformer<string> = (value: string) => value.toLowerCase();

/**
 * Convert to uppercase
 */
export const toUpperCase: SameTypeTransformer<string> = (value: string) => value.toUpperCase();

/**
 * Capitalize first letter
 */
export const capitalize: SameTypeTransformer<string> = (value: string) => {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords: SameTypeTransformer<string> = (value: string) => {
  return value
    .split(' ')
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word))
    .join(' ');
};
