/**
 * Never Validator
 * @module schema/special/never
 */

import type { IValidator, ValidationContext, ValidationResult } from '#types/index';

/**
 * Never validator - always fails
 */
export class NeverValidator implements IValidator<unknown, never> {
  readonly _type = 'never';

  validate(_value: unknown, context?: ValidationContext): ValidationResult<never> {
    const ctx = context ?? { path: [], field: '', locale: 'en' };
    return {
      success: false,
      data: undefined,
      errors: [
        {
          code: 'never.invalid',
          message: 'This value should never exist',
          path: ctx.path,
          field: ctx.field,
        },
      ],
    };
  }
}
