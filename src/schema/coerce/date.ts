/**
 * Coerce Date Validator
 * @module schema/coerce/date
 */

import type { IValidator, ValidationContext, ValidationResult } from '#types/index';

/**
 * Coerce to date validator
 */
export class CoerceDateValidator implements IValidator<unknown, Date> {
  readonly _type = 'coerce.date';

  validate(value: unknown, context?: ValidationContext): ValidationResult<Date> {
    const ctx = context ?? { path: [], field: '', locale: 'en' };

    let date: Date;

    if (value instanceof Date) {
      date = value;
    } else if (typeof value === 'string' || typeof value === 'number') {
      date = new Date(value);
    } else {
      return {
        success: false,
        data: undefined,
        errors: [
          {
            code: 'coerce.date',
            message: 'Cannot coerce value to date',
            path: ctx.path,
            field: ctx.field,
          },
        ],
      };
    }

    if (Number.isNaN(date.getTime())) {
      return {
        success: false,
        data: undefined,
        errors: [
          {
            code: 'coerce.date',
            message: 'Cannot coerce value to valid date',
            path: ctx.path,
            field: ctx.field,
          },
        ],
      };
    }

    return {
      success: true,
      data: date,
      errors: [],
    };
  }
}
