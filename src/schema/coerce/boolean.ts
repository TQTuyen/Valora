/**
 * Coerce Boolean Validator
 * @module schema/coerce/boolean
 */

import type { IValidator, ValidationContext, ValidationResult } from '#types/index';

/**
 * Coerce to boolean validator
 */
export class CoerceBooleanValidator implements IValidator<unknown, boolean> {
  readonly _type = 'coerce.boolean';

  validate(value: unknown, _context?: ValidationContext): ValidationResult<boolean> {
    return {
      success: true,
      data: Boolean(value),
      errors: [],
    };
  }
}
