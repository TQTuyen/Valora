/**
 * Non-Negative Strategy
 * @module validators/number/strategies/non-negative
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/** Non-negative strategy (>= 0) */
export class NonNegativeStrategy extends BaseValidationStrategy<number, number> {
  readonly name = 'nonNegative';

  constructor(options?: ValidationOptions) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: number, context: ValidationContext): ValidationResult<number> {
    if (value < 0) {
      return this.failure('number.nonNegative', context);
    }
    return this.success(value, context);
  }
}
