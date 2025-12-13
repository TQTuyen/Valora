/**
 * Negative Strategy
 * @module validators/number/strategies/negative
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/** Negative number strategy */
export class NegativeStrategy extends BaseValidationStrategy<number, number> {
  readonly name = 'negative';

  validate(value: number, context: ValidationContext): ValidationResult<number> {
    if (value >= 0) {
      return this.failure('number.negative', context);
    }
    return this.success(value, context);
  }
}
