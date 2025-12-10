/**
 * Deep Clone Utility
 * @module utils/clone
 */

/**
 * Deep clone an object without unnecessary overhead
 * Handles primitives, arrays, dates, and plain objects
 * @template T - Type of the value
 * @param obj - Object to clone
 * @returns Cloned object
 */
export function deepClone<T>(obj: T): T {
  // Handle primitives and null
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  // Handle Array
  if (Array.isArray(obj)) {
    return obj.map(deepClone) as T;
  }

  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags) as T;
  }

  // Handle plain objects
  const cloned = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}
