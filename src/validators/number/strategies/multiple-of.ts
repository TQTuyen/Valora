/**
 * Multiple Of Strategy
 * @module validators/number/strategies/multiple-of
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/** Multiple of strategy */
export class MultipleOfStrategy extends BaseValidationStrategy<number, number> {
  readonly name = 'multipleOf';

  constructor(private readonly factor: number) {
    super();
  }

  validate(value: number, context: ValidationContext): ValidationResult<number> {
    if (value % this.factor !== 0) {
      return this.failure('number.multipleOf', context, { factor: this.factor });
    }
    return this.success(value, context);
  }
}
