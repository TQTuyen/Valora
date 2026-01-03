/**
 * Min Date Strategy
 * @module validators/date/strategies/min-date
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/** Minimum date strategy */
export class MinDateStrategy extends BaseValidationStrategy<Date, Date> {
  readonly name = 'minDate';

  constructor(
    private readonly minDate: Date,
    options?: ValidationOptions,
  ) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: Date, context: ValidationContext): ValidationResult<Date> {
    if (value.getTime() < this.minDate.getTime()) {
      return this.failure('date.min', context, {
        date: this.minDate.toISOString(),
      });
    }
    return this.success(value, context);
  }
}
