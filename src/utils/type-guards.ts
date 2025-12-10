/**
 * Type Guard Utilities
 * @module utils/type-guards
 */

/**
 * Check if a value is a plain object
 * @param value - Value to check
 * @returns true if value is a plain object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Check if a value is a string
 * @param value - Value to check
 * @returns true if value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Check if a value is a number (excluding NaN)
 * @param value - Value to check
 * @returns true if value is a valid number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

/**
 * Check if a value is a boolean
 * @param value - Value to check
 * @returns true if value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Check if a value is a valid Date
 * @param value - Value to check
 * @returns true if value is a valid Date
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

/**
 * Check if a value is an array
 * @param value - Value to check
 * @returns true if value is an array
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Check if a value is a function
 * @param value - Value to check
 * @returns true if value is a function
 */
export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === 'function';
}

/**
 * Check if a value is null or undefined
 * @param value - Value to check
 * @returns true if value is null or undefined
 */
export function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 * @param value - Value to check
 * @returns true if value is empty
 */
export function isEmpty(value: unknown): boolean {
  if (isNil(value)) {
    return true;
  }
  if (typeof value === 'string') {
    return value.trim().length === 0;
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (isObject(value)) {
    return Object.keys(value).length === 0;
  }
  return false;
}
