/**
 * Validation Error Class
 * @module decorators/class/validation-error
 */

import type { ValidationError } from '#types/index';

/**
 * Validation error thrown when class validation fails
 */
export class ValoraValidationError extends Error {
  constructor(
    message: string,
    public readonly errors: ReadonlyArray<ValidationError>,
  ) {
    super(message);
    this.name = 'ValoraValidationError';

    // Maintain proper stack trace (V8 engines)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValoraValidationError);
    }
  }
}
