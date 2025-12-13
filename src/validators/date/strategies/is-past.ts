/**
 * Is Past Strategy
 * @module validators/date/strategies/is-past
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/** Must be in the past strategy */
export class IsPastStrategy extends BaseValidationStrategy<Date, Date> {
  readonly name = 'isPast';

  validate(value: Date, context: ValidationContext): ValidationResult<Date> {
    if (value.getTime() >= Date.now()) {
      return this.failure('date.past', context);
    }
    return this.success(value, context);
  }
}
