/**
 * Transform Plugin - Array Transforms
 * @module plugins/transform/transforms/array
 */

export * from './aggregation';
export * from './chunking';
export * from './filtering';
export * from './flattening';
export * from './joining';
export * from './mapping';
export * from './slicing';
export * from './sorting';
export * from './utility';

// Re-export as collection for backwards compatibility
import { average, first, last, maxValue, minValue, sum } from './aggregation';
import { chunk, partition } from './chunking';
import { compact, filter, removeNullish, unique } from './filtering';
import { flatten, flattenDeep, flattenDepth } from './flattening';
import { join } from './joining';
import { flatMap, map } from './mapping';
import { drop, dropLast, slice, take, takeLast } from './slicing';
import { reverse, shuffle, sort, sortBy } from './sorting';
import { find, findIndex, groupBy, includes, length, zip } from './utility';

export const arrayTransforms = {
  // Filtering
  unique,
  compact,
  filter,
  removeNullish,

  // Mapping
  map,
  flatMap,

  // Sorting
  sort,
  sortBy,
  reverse,
  shuffle,

  // Slicing
  take,
  drop,
  takeLast,
  dropLast,
  slice,

  // Chunking
  chunk,
  partition,

  // Flattening
  flatten,
  flattenDeep,
  flattenDepth,

  // Joining
  join,

  // Aggregation
  first,
  last,
  sum,
  average,
  minValue,
  maxValue,

  // Utility
  find,
  findIndex,
  includes,
  length,
  zip,
  groupBy,
};
