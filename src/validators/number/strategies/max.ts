/**
 * Max Strategy
 * @module validators/number/strategies/max
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/** Maximum value strategy */
export class MaxStrategy extends BaseValidationStrategy<number, number> {
  readonly name = 'max';

  constructor(private readonly max: number) {
    super();
  }

  validate(value: number, context: ValidationContext): ValidationResult<number> {
    if (value > this.max) {
      return this.failure('number.max', context, { max: this.max, actual: value });
    }
    return this.success(value, context);
  }
}
