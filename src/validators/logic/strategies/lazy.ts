/**
 * Lazy Strategy
 * @module validators/logic/strategies/lazy
 */

import { BaseValidationStrategy } from '@core/index';

import type {
  IValidator,
  ValidationContext,
  ValidationOptions,
  ValidationResult,
} from '#types/index';

/** Lazy evaluation strategy for recursive types */
export class LazyStrategy<T, U> extends BaseValidationStrategy<T, U> {
  readonly name = 'lazy';
  private cachedValidator?: IValidator<T, U>;

  constructor(
    private readonly factory: () => IValidator<T, U>,
    options?: ValidationOptions,
  ) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: T, context: ValidationContext): ValidationResult<U> {
    this.cachedValidator ??= this.factory();
    const result = this.cachedValidator.validate(value, context);
    if (!result.success && this.customMessage) {
      return this.failure('logic.lazy', context);
    }
    return result;
  }
}
