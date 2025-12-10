/**
 * Validation Result Utilities
 * @module utils/validation
 */

import type { ValidationError, ValidationResult } from '#types/index';

/**
 * Create a successful validation result
 * @template T - Type of the validated value
 * @param value - The validated value
 * @returns Validation result indicating success
 */
export function createSuccessResult<T>(value: T): ValidationResult<T> {
  return {
    success: true,
    data: value,
    errors: [],
  };
}

/**
 * Create a failed validation result
 * @template T - Type of the expected value
 * @param errors - Array of validation errors
 * @returns Validation result indicating failure
 */
export function createFailureResult<T>(errors: ValidationError[]): ValidationResult<T> {
  return {
    success: false,
    data: undefined,
    errors,
  };
}

/**
 * Create a validation error
 * @param code - Error code
 * @param message - Error message
 * @param path - Path to the error
 * @param metadata - Additional metadata
 * @returns Validation error object
 */
export function createError(
  code: string,
  message: string,
  path: ReadonlyArray<string | number> = [],
  metadata?: Record<string, unknown>,
): ValidationError {
  const fieldName = path.length > 0 ? String(path[path.length - 1]) : '';
  const result: ValidationError = {
    code,
    message,
    path: [...path],
    field: fieldName,
  };
  if (metadata !== undefined) {
    result.metadata = metadata;
  }
  return result;
}

/**
 * Merge two validation results
 * @template T - Type of the validated value
 * @param first - First result
 * @param second - Second result
 * @returns Merged result
 */
export function mergeResults<T>(
  first: ValidationResult<T>,
  second: ValidationResult<T>,
): ValidationResult<T> {
  return {
    success: first.success && second.success,
    data: second.data ?? first.data,
    errors: [...first.errors, ...second.errors],
  };
}

/**
 * Prefix errors with a path segment
 * @param errors - Array of errors
 * @param prefix - Path segment to prefix
 * @returns New array with prefixed paths
 */
export function prefixErrors(
  errors: ReadonlyArray<ValidationError>,
  prefix: string | number,
): ValidationError[] {
  return errors.map((error) => ({
    ...error,
    path: [prefix, ...error.path],
    field: String(prefix),
  }));
}
