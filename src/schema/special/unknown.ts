/**
 * Unknown Validator
 * @module schema/special/unknown
 */

import type { IValidator, ValidationContext, ValidationResult } from '#types/index';

/**
 * Unknown validator - accepts any value but requires explicit type narrowing
 */
export class UnknownValidator implements IValidator<unknown, unknown> {
  readonly _type = 'unknown';

  validate(value: unknown, _context?: ValidationContext): ValidationResult {
    return {
      success: true,
      data: value,
      errors: [],
    };
  }
}
