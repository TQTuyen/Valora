/**
 * Min Strategy
 * @module validators/number/strategies/min
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/** Minimum value strategy */
export class MinStrategy extends BaseValidationStrategy<number, number> {
  readonly name = 'min';

  constructor(private readonly min: number) {
    super();
  }

  validate(value: number, context: ValidationContext): ValidationResult<number> {
    if (value < this.min) {
      return this.failure('number.min', context, { min: this.min, actual: value });
    }
    return this.success(value, context);
  }
}
