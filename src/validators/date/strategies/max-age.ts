/**
 * Max Age Strategy
 * @module validators/date/strategies/max-age
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/** Maximum age validation strategy */
export class MaxAgeStrategy extends BaseValidationStrategy<Date, Date> {
  readonly name = 'maxAge';

  constructor(
    private readonly maxYears: number,
    options?: ValidationOptions,
  ) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: Date, context: ValidationContext): ValidationResult<Date> {
    const today = new Date();
    const birthDate = new Date(value);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age > this.maxYears) {
      return this.failure('date.maxAge', context, { years: this.maxYears });
    }
    return this.success(value, context);
  }
}
