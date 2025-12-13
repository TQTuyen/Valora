/**
 * Safe Integer Strategy
 * @module validators/number/strategies/safe-integer
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/** Safe integer strategy */
export class SafeIntegerStrategy extends BaseValidationStrategy<number, number> {
  readonly name = 'safe';

  validate(value: number, context: ValidationContext): ValidationResult<number> {
    if (!Number.isSafeInteger(value)) {
      return this.failure('number.safe', context);
    }
    return this.success(value, context);
  }
}
