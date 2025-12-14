/**
 * Array Max Length Strategy
 * @module validators/array/strategies/max-length
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/**
 * Maximum length strategy
 */
export class MaxLengthArrayStrategy<T> extends BaseValidationStrategy<T[], T[]> {
  readonly name = 'maxLength';

  constructor(private readonly maxLength: number) {
    super();
  }

  validate(value: T[], context: ValidationContext): ValidationResult<T[]> {
    if (value.length > this.maxLength) {
      return this.failure('array.maxLength', context, { max: this.maxLength });
    }
    return this.success(value, context);
  }
}
