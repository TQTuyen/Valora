/**
 * Is Weekend Strategy
 * @module validators/date/strategies/is-weekend
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/** Must be a weekend strategy */
export class IsWeekendStrategy extends BaseValidationStrategy<Date, Date> {
  readonly name = 'isWeekend';

  constructor(options?: ValidationOptions) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: Date, context: ValidationContext): ValidationResult<Date> {
    const day = value.getDay();
    if (day !== 0 && day !== 6) {
      return this.failure('date.weekend', context);
    }
    return this.success(value, context);
  }
}
