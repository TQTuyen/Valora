/**
 * Is Today Strategy
 * @module validators/date/strategies/is-today
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/** Must be today strategy */
export class IsTodayStrategy extends BaseValidationStrategy<Date, Date> {
  readonly name = 'isToday';

  validate(value: Date, context: ValidationContext): ValidationResult<Date> {
    const today = new Date();
    const isToday =
      value.getDate() === today.getDate() &&
      value.getMonth() === today.getMonth() &&
      value.getFullYear() === today.getFullYear();

    if (!isToday) {
      return this.failure('date.today', context);
    }
    return this.success(value, context);
  }
}
