/**
 * Is Weekday Strategy
 * @module validators/date/strategies/is-weekday
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/** Must be a weekday strategy */
export class IsWeekdayStrategy extends BaseValidationStrategy<Date, Date> {
  readonly name = 'isWeekday';

  constructor(options?: ValidationOptions) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: Date, context: ValidationContext): ValidationResult<Date> {
    const day = value.getDay();
    if (day === 0 || day === 6) {
      return this.failure('date.weekday', context);
    }
    return this.success(value, context);
  }
}
