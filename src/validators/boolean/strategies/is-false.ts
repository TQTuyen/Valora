/**
 * Boolean Is False Strategy
 * @module validators/boolean/strategies/is-false
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/**
 * Must be false strategy
 */
export class IsFalseStrategy extends BaseValidationStrategy<boolean, boolean> {
  readonly name = 'isFalse';

  validate(value: boolean, context: ValidationContext): ValidationResult<boolean> {
    if (value) {
      return this.failure('boolean.isFalse', context);
    }
    return this.success(value, context);
  }
}
