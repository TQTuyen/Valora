/**
 * Non-Negative Strategy
 * @module validators/number/strategies/non-negative
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/** Non-negative strategy (>= 0) */
export class NonNegativeStrategy extends BaseValidationStrategy<number, number> {
  readonly name = 'nonNegative';

  validate(value: number, context: ValidationContext): ValidationResult<number> {
    if (value < 0) {
      return this.failure('number.nonNegative', context);
    }
    return this.success(value, context);
  }
}
