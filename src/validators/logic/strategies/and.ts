/**
 * AND Strategy
 * @module validators/logic/strategies/and
 */

import { BaseValidationStrategy } from '@core/index';

import type { IValidator, ValidationContext, ValidationResult } from '#types/index';

/** AND combinator - all validators must pass */
export class AndStrategy<T, U> extends BaseValidationStrategy<T, U> {
  readonly name = 'and';

  constructor(private readonly validators: IValidator<T, U>[]) {
    super();
  }

  validate(value: T, context: ValidationContext): ValidationResult<U> {
    let result: U = value as unknown as U;

    for (const validator of this.validators) {
      const validationResult = validator.validate(result as unknown as T, context);

      if (!validationResult.success) {
        return validationResult;
      }

      result = validationResult.data as U;
    }

    return this.success(result, context);
  }
}
