/**
 * Array Min Length Strategy
 * @module validators/array/strategies/min-length
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/**
 * Minimum length strategy
 */
export class MinLengthArrayStrategy<T> extends BaseValidationStrategy<T[], T[]> {
  readonly name = 'minLength';

  constructor(private readonly minLength: number) {
    super();
  }

  validate(value: T[], context: ValidationContext): ValidationResult<T[]> {
    if (value.length < this.minLength) {
      return this.failure('array.minLength', context, { min: this.minLength });
    }
    return this.success(value, context);
  }
}
