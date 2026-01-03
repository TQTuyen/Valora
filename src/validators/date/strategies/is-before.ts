/**
 * Is Before Strategy
 * @module validators/date/strategies/is-before
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/** Must be before date strategy */
export class IsBeforeStrategy extends BaseValidationStrategy<Date, Date> {
  readonly name = 'isBefore';

  constructor(
    private readonly beforeDate: Date,
    options?: ValidationOptions,
  ) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: Date, context: ValidationContext): ValidationResult<Date> {
    if (value.getTime() >= this.beforeDate.getTime()) {
      return this.failure('date.before', context, {
        date: this.beforeDate.toISOString(),
      });
    }
    return this.success(value, context);
  }
}
