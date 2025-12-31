/**
 * Transform Plugin - Object Transforms
 * @module plugins/transform/transforms/object
 */

export * from './immutability';
export * from './mapping';
export * from './merging';
export * from './selection';
export * from './utility';

// Re-export as collection for backwards compatibility
import { freeze, seal } from './immutability';
import { filterObject, mapKeys, mapValues } from './mapping';
import { deepMerge, defaults, merge } from './merging';
import { omit, pick } from './selection';
import { clone, entries, fromEntries, fromJSON, keys, toJSON, values } from './utility';

export const objectTransforms = {
  // Selection
  pick,
  omit,

  // Merging
  merge,
  defaults,
  deepMerge,

  // Mapping
  mapValues,
  mapKeys,
  filterObject,

  // Immutability
  freeze,
  seal,

  // Utility
  keys,
  values,
  entries,
  fromEntries,
  clone,
  toJSON,
  fromJSON,
};
