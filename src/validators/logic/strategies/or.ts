/**
 * OR Strategy
 * @module validators/logic/strategies/or
 */

import { BaseValidationStrategy } from '@core/index';

import type {
  IValidator,
  ValidationContext,
  ValidationOptions,
  ValidationResult,
} from '#types/index';

/** OR combinator - at least one validator must pass */
export class OrStrategy<T, U> extends BaseValidationStrategy<T, U> {
  readonly name = 'or';

  constructor(
    private readonly validators: IValidator<T, U>[],
    options?: ValidationOptions,
  ) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
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

    return this.failure('logic.or', context);
  }
}
