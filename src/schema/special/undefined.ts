/**
 * Undefined Validator
 * @module schema/special/undefined
 */

import type { IValidator, ValidationContext, ValidationResult } from '#types/index';

/**
 * Undefined validator - only accepts undefined
 */
export class UndefinedValidator implements IValidator<unknown, undefined> {
  readonly _type = 'undefined';

  validate(value: unknown, context?: ValidationContext): ValidationResult<undefined> {
    const ctx = context ?? { path: [], field: '', locale: 'en' };
    if (value !== undefined) {
      return {
        success: false,
        data: undefined,
        errors: [
          {
            code: 'undefined.type',
            message: 'Expected undefined',
            path: ctx.path,
            field: ctx.field,
          },
        ],
      };
    }
    return {
      success: true,
      data: undefined,
      errors: [],
    };
  }
}
