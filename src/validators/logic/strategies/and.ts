/**
 * AND Strategy
 * @module validators/logic/strategies/and
 */

import { BaseValidationStrategy } from '@core/index';

import type {
  IValidator,
  ValidationContext,
  ValidationOptions,
  ValidationResult,
} from '#types/index';

/** AND combinator - all validators must pass */
export class AndStrategy<T, U> extends BaseValidationStrategy<T, U> {
  readonly name = 'and';

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
    let result: U = value as unknown as U;

    for (const validator of this.validators) {
      const validationResult = validator.validate(result as unknown as T, context);

      if (!validationResult.success) {
        if (this.customMessage) {
          return this.failure('logic.and', context);
        }
        return validationResult;
      }

      result = validationResult.data as U;
    }

    return this.success(result, context);
  }
}
