/**
 * Positive Strategy
 * @module validators/number/strategies/positive
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/** Positive number strategy */
export class PositiveStrategy extends BaseValidationStrategy<number, number> {
  readonly name = 'positive';

  validate(value: number, context: ValidationContext): ValidationResult<number> {
    if (value <= 0) {
      return this.failure('number.positive', context);
    }
    return this.success(value, context);
  }
}
