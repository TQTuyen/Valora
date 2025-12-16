/**
 * OR Strategy
 * @module validators/logic/strategies/or
 */

import { BaseValidationStrategy } from '@core/index';
import { createError } from '@utils/index';

import type { IValidator, ValidationContext, ValidationResult } from '#types/index';

/** OR combinator - at least one validator must pass */
export class OrStrategy<T, U> extends BaseValidationStrategy<T, U> {
  readonly name = 'or';

  constructor(private readonly validators: IValidator<T, U>[]) {
    super();
  }

  validate(value: T, context: ValidationContext): ValidationResult<U> {
    const allErrors: ValidationResult<U>['errors'] = [];

    for (const validator of this.validators) {
      const result = validator.validate(value, context);

      if (result.success) {
        return result;
      }

      allErrors.push(...result.errors);
    }

    return {
      success: false,
      errors: [
        createError('logic.or', 'Value did not match any of the expected types', context.path),
      ],
      data: undefined,
    };
  }
}
