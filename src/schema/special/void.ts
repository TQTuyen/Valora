/**
 * Void Validator
 * @module schema/special/void
 */

import type { IValidator, ValidationContext, ValidationResult } from '#types/index';

/**
 * Void validator - only accepts undefined
 */
export class VoidValidator implements IValidator<unknown, void> {
  readonly _type = 'void';

  validate(value: unknown, context?: ValidationContext): ValidationResult<void> {
    const ctx = context ?? { path: [], field: '', locale: 'en' };
    if (value !== undefined) {
      return {
        success: false,
        data: undefined,
        errors: [
          {
            code: 'void.type',
            message: 'Expected void (undefined)',
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
