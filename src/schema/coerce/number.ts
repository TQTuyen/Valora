/**
 * Coerce Number Validator
 * @module schema/coerce/number
 */

import type { IValidator, ValidationContext, ValidationResult } from '#types/index';

/**
 * Coerce to number validator
 */
export class CoerceNumberValidator implements IValidator<unknown, number> {
  readonly _type = 'coerce.number';

  validate(value: unknown, context?: ValidationContext): ValidationResult<number> {
    const ctx = context ?? { path: [], field: '', locale: 'en' };
    const num = Number(value);

    if (Number.isNaN(num)) {
      return {
        success: false,
        data: undefined,
        errors: [
          {
            code: 'coerce.number',
            message: 'Cannot coerce value to number',
            path: ctx.path,
            field: ctx.field,
          },
        ],
      };
    }

    return {
      success: true,
      data: num,
      errors: [],
    };
  }
}
