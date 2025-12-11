/**
 * Coerce String Validator
 * @module schema/coerce/string
 */

import type { IValidator, ValidationContext, ValidationResult } from '#types/index';

/**
 * Coerce to string validator
 */
export class CoerceStringValidator implements IValidator<unknown, string> {
  readonly _type = 'coerce.string';

  validate(value: unknown, _context?: ValidationContext): ValidationResult<string> {
    return {
      success: true,
      data: String(value),
      errors: [],
    };
  }
}
