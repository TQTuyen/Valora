/**
 * Validation Error Types
 * @module types/errors
 */

/**
 * Represents a single validation error
 */
export interface ValidationError {
  /** Error code identifier (e.g., 'string.email', 'number.min') */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Path to the field that failed validation */
  path: (string | number)[];
  /** Field name for convenience */
  field: string;
  /** Additional metadata about the error */
  metadata?: Record<string, unknown>;
}
