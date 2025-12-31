/**
 * Transform Plugin - Object Utility Transforms
 * @module plugins/transform/transforms/object/utility
 */

import type { SameTypeTransformer, Transformer } from '../../types';

/**
 * Get object keys
 */
export const keys: Transformer<Record<string, unknown>, string[]> = (value) => Object.keys(value);

/**
 * Get object values
 */
export const values: Transformer<Record<string, unknown>, unknown[]> = (value) =>
  Object.values(value);

/**
 * Get object entries
 */
export const entries: Transformer<Record<string, unknown>, [string, unknown][]> = (value) =>
  Object.entries(value);

/**
 * Convert entries to object
 */
export const fromEntries: Transformer<[string, unknown][], Record<string, unknown>> = (value) =>
  Object.fromEntries(value);

/**
 * Clone object (shallow)
 */
export const clone: SameTypeTransformer<Record<string, unknown>> = (value) => ({ ...value });

/**
 * Convert to JSON string
 */
export function toJSON(space?: number): Transformer<unknown, string> {
  return (value: unknown) => JSON.stringify(value, null, space);
}

/**
 * Parse from JSON string
 */
export const fromJSON: Transformer<string> = (value: string) => JSON.parse(value);
