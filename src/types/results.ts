/**
 * Validation Result Types
 * @module types/results
 */

import type { ValidationError } from './errors';

/**
 * Result of a validation operation
 * @template T - The type of the validated value
 */
export interface ValidationResult<T = unknown> {
  /** Whether the validation passed */
  success: boolean;
  /** The validated/transformed value (undefined if validation failed) */
  data: T | undefined;
  /** Array of validation errors */
  errors: ValidationError[];
}

/**
 * Context passed to validators during validation
 */
export interface ValidationContext {
  /** Current path in the validation tree */
  path: (string | number)[];
  /** Current field name */
  field: string;
  /** Current locale for i18n */
  locale: string;
  /** Root data being validated (for cross-field validation) */
  data?: unknown;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}
