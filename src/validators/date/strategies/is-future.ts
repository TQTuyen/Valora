/**
 * Is Future Strategy
 * @module validators/date/strategies/is-future
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/** Must be in the future strategy */
export class IsFutureStrategy extends BaseValidationStrategy<Date, Date> {
  readonly name = 'isFuture';

  constructor(options?: ValidationOptions) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: Date, context: ValidationContext): ValidationResult<Date> {
    if (value.getTime() <= Date.now()) {
      return this.failure('date.future', context);
    }
    return this.success(value, context);
  }
}
