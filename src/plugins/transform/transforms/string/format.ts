/**
 * Transform Plugin - String Format Transforms
 * @module plugins/transform/transforms/string/format
 */

import type { SameTypeTransformer } from '../../types';

/**
 * Convert to URL-friendly slug
 */
export const slug: SameTypeTransformer<string> = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Convert to camelCase
 */
export const camelCase: SameTypeTransformer<string> = (value: string) => {
  return value
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_match: string, char: string) => char.toUpperCase());
};

/**
 * Convert to snake_case
 */
export const snakeCase: SameTypeTransformer<string> = (value: string) => {
  return value
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
};

/**
 * Convert to kebab-case
 */
export const kebabCase: SameTypeTransformer<string> = (value: string) => {
  return value
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
