/**
 * Is After Strategy
 * @module validators/date/strategies/is-after
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/** Must be after date strategy */
export class IsAfterStrategy extends BaseValidationStrategy<Date, Date> {
  readonly name = 'isAfter';

  constructor(
    private readonly afterDate: Date,
    options?: ValidationOptions,
  ) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: Date, context: ValidationContext): ValidationResult<Date> {
    if (value.getTime() <= this.afterDate.getTime()) {
      return this.failure('date.after', context, {
        date: this.afterDate.toISOString(),
      });
    }
    return this.success(value, context);
  }
}
