/**
 * Max Date Strategy
 * @module validators/date/strategies/max-date
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/** Maximum date strategy */
export class MaxDateStrategy extends BaseValidationStrategy<Date, Date> {
  readonly name = 'maxDate';

  constructor(
    private readonly maxDate: Date,
    options?: ValidationOptions,
  ) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: Date, context: ValidationContext): ValidationResult<Date> {
    if (value.getTime() > this.maxDate.getTime()) {
      return this.failure('date.max', context, {
        date: this.maxDate.toISOString(),
      });
    }
    return this.success(value, context);
  }
}
