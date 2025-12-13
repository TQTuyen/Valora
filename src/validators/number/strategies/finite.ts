/**
 * Finite Strategy
 * @module validators/number/strategies/finite
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/** Finite number strategy */
export class FiniteStrategy extends BaseValidationStrategy<number, number> {
  readonly name = 'finite';

  validate(value: number, context: ValidationContext): ValidationResult<number> {
    if (!Number.isFinite(value)) {
      return this.failure('number.finite', context);
    }
    return this.success(value, context);
  }
}
