/**
 * Valora Utility Functions
 * Helper utilities for the validation framework
 * @module utils
 */

// Clone Utilities
export { deepClone } from './clone';

// Path Utilities
export { getByPath, pathToString, setByPath, stringToPath } from './path';

// Type Guards
export {
  isArray,
  isBoolean,
  isDate,
  isEmpty,
  isFunction,
  isNil,
  isNumber,
  isObject,
  isString,
} from './type-guards';

// Object Utilities
export { deepMerge, omit, pick } from './object';

// String Utilities
export { capitalize, interpolate } from './string';

// Validation Utilities
export {
  createError,
  createFailureResult,
  createSuccessResult,
  mergeResults,
  prefixErrors,
} from './validation';

// ID Generation
export { uniqueId } from './id';

// Timing Utilities
export { measure } from './timing';

// Regex Patterns
export { patterns } from './patterns';
