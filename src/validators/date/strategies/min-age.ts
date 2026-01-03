/**
 * Min Age Strategy
 * @module validators/date/strategies/min-age
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/** Age validation strategy */
export class MinAgeStrategy extends BaseValidationStrategy<Date, Date> {
  readonly name = 'minAge';

  constructor(
    private readonly minYears: number,
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

    if (age < this.minYears) {
      return this.failure('date.minAge', context, { years: this.minYears });
    }
    return this.success(value, context);
  }
}
