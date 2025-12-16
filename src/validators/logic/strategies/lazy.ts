/**
 * Lazy Strategy
 * @module validators/logic/strategies/lazy
 */

import { BaseValidationStrategy } from '@core/index';

import type { IValidator, ValidationContext, ValidationResult } from '#types/index';

/** Lazy evaluation strategy for recursive types */
export class LazyStrategy<T, U> extends BaseValidationStrategy<T, U> {
  readonly name = 'lazy';
  private cachedValidator?: IValidator<T, U>;

  constructor(private readonly factory: () => IValidator<T, U>) {
    super();
  }

  validate(value: T, context: ValidationContext): ValidationResult<U> {
    this.cachedValidator ??= this.factory();
    return this.cachedValidator.validate(value, context);
  }
}
