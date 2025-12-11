/**
 * Null Validator
 * @module schema/special/null
 */

import type { IValidator, ValidationContext, ValidationResult } from '#types/index';

/**
 * Null validator - only accepts null
 */
export class NullValidator implements IValidator<unknown, null> {
  readonly _type = 'null';

  validate(value: unknown, context?: ValidationContext): ValidationResult<null> {
    const ctx = context ?? { path: [], field: '', locale: 'en' };
    if (value !== null) {
      return {
        success: false,
        data: undefined,
        errors: [
          {
            code: 'null.type',
            message: 'Expected null',
            path: ctx.path,
            field: ctx.field,
          },
        ],
      };
    }
    return {
      success: true,
      data: null,
      errors: [],
    };
  }
}
