/**
 * NOT Strategy
 * @module validators/logic/strategies/not
 */

import { BaseValidationStrategy } from '@core/index';

import type { IValidator, ValidationContext, ValidationResult } from '#types/index';

/** NOT combinator - validator must fail */
export class NotStrategy<T> extends BaseValidationStrategy<T, T> {
  readonly name = 'not';

  constructor(private readonly validator: IValidator<T, unknown>) {
    super();
  }

  validate(value: T, context: ValidationContext): ValidationResult<T> {
    const result = this.validator.validate(value, context);

    if (result.success) {
      return this.failure('logic.not', context);
    }

    return this.success(value, context);
  }
}
