/**
 * Transform Plugin - String Transforms
 * @module plugins/transform/transforms/string
 */

export * from './case';
export * from './conversion';
export * from './extraction';
export * from './format';
export * from './padding';
export * from './removal';
export * from './replacement';
export * from './truncation';
export * from './utility';

// Re-export as collection for backwards compatibility
import { capitalize, capitalizeWords, toLowerCase, toUpperCase, trim } from './case';
import { parseFloat, parseInt, toNumber } from './conversion';
import { slice, substring } from './extraction';
import { camelCase, kebabCase, slug, snakeCase } from './format';
import { padEnd, padStart } from './padding';
import { normalizeWhitespace, removeNonAlphanumeric, removeWhitespace } from './removal';
import { replace, replaceAll } from './replacement';
import { truncate } from './truncation';
import { repeat, reverse, split } from './utility';

export const stringTransforms = {
  // Case
  trim,
  toLowerCase,
  toUpperCase,
  capitalize,
  capitalizeWords,

  // Format
  slug,
  camelCase,
  snakeCase,
  kebabCase,

  // Truncation
  truncate,

  // Padding
  padStart,
  padEnd,

  // Removal
  removeWhitespace,
  normalizeWhitespace,
  removeNonAlphanumeric,

  // Replacement
  replace,
  replaceAll,

  // Extraction
  substring,
  slice,

  // Utility
  reverse,
  repeat,
  split,

  // Conversion
  toNumber,
  parseInt,
  parseFloat,
};
