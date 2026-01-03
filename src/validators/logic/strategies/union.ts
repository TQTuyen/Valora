/**
 * Union Strategy
 * @module validators/logic/strategies/union
 */

import { BaseValidationStrategy } from '@core/index';

import type {
  IValidator,
  ValidationContext,
  ValidationOptions,
  ValidationResult,
} from '#types/index';

/** Union type validator - value must match one of the types */
export class UnionStrategy<T, U> extends BaseValidationStrategy<T, U> {
  readonly name = 'union';

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
    for (const validator of this.validators) {
      const result = validator.validate(value, context);
      if (result.success) {
        return result;
      }
    }

    return this.failure('logic.union', context);
  }
}
