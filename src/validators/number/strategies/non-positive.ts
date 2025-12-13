/**
 * Non-Positive Strategy
 * @module validators/number/strategies/non-positive
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/** Non-positive strategy (<= 0) */
export class NonPositiveStrategy extends BaseValidationStrategy<number, number> {
  readonly name = 'nonPositive';

  validate(value: number, context: ValidationContext): ValidationResult<number> {
    if (value > 0) {
      return this.failure('number.nonPositive', context);
    }
    return this.success(value, context);
  }
}
