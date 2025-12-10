/**
 * Validation result utility functions
 * @module core/utils/results
 */

import type { ValidationError, ValidationResult } from '#types/index';

/**
 * Create a success validation result
 */
export function createSuccessResult<T>(value: T): ValidationResult<T> {
  return {
    success: true,
    data: value,
    errors: [],
  };
}

/**
 * Create a failure validation result
 */
export function createFailureResult<T>(errors: ValidationError[]): ValidationResult<T> {
  return {
    success: false,
    data: undefined,
    errors,
  };
}

/**
 * Create a validation error object
 */
export function createError(
  code: string,
  message: string,
  path: (string | number)[],
  field?: string,
  metadata?: Record<string, unknown>,
): ValidationError {
  const error: ValidationError = {
    code,
    message,
    path,
    field: field ?? path[path.length - 1]?.toString() ?? '',
  };
  if (metadata !== undefined) {
    error.metadata = metadata;
  }
  return error;
}
