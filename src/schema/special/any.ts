/**
 * Any Validator
 * @module schema/special/any
 */

import type { IValidator, ValidationContext, ValidationResult } from '#types/index';

/**
 * Any validator - accepts any value
 */
export class AnyValidator implements IValidator<unknown, unknown> {
  readonly _type = 'any';

  validate(value: unknown, _context?: ValidationContext): ValidationResult {
    return {
      success: true,
      data: value,
      errors: [],
    };
  }
}
