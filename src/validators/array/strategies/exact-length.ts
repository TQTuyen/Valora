/**
 * Array Exact Length Strategy
 * @module validators/array/strategies/exact-length
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/**
 * Exact length strategy
 */
export class ExactLengthArrayStrategy<T> extends BaseValidationStrategy<T[], T[]> {
  readonly name = 'length';

  constructor(private readonly exactLength: number) {
    super();
  }

  validate(value: T[], context: ValidationContext): ValidationResult<T[]> {
    if (value.length !== this.exactLength) {
      return this.failure('array.length', context, { length: this.exactLength });
    }
    return this.success(value, context);
  }
}
