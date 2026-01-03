/**
 * Date Validator
 * @module validators/date/validator
 */

import { BaseValidator } from '@validators/common/index';

import {
  IsAfterStrategy,
  IsBeforeStrategy,
  IsFutureStrategy,
  IsPastStrategy,
  IsTodayStrategy,
  IsWeekdayStrategy,
  IsWeekendStrategy,
  MaxAgeStrategy,
  MaxDateStrategy,
  MinAgeStrategy,
  MinDateStrategy,
} from './strategies';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/**
 * Date validator with fluent API
 *
 * @example
 * ```typescript
 * const birthdateValidator = new DateValidator()
 *   .required()
 *   .past()
 *   .minAge(18);
 *
 * const result = birthdateValidator.validate(new Date('1990-01-01'));
 * ```
 */
export class DateValidator extends BaseValidator<unknown, Date> {
  readonly _type = 'date';

  protected clone(): DateValidator {
    const cloned = new DateValidator();
    cloned.strategies = [...this.strategies];
    cloned.isRequired = this.isRequired;
    if (this.customMessage !== undefined) {
      cloned.customMessage = this.customMessage;
    }
    return cloned;
  }

  protected override checkType(value: unknown, context: ValidationContext): ValidationResult<Date> {
    // Accept Date objects
    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) {
        return this.fail('date.invalid', context);
      }
      return this.succeed(value, context);
    }

    // Accept valid date strings
    if (typeof value === 'string') {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        return this.succeed(parsed, context);
      }
    }

    // Accept timestamps
    if (typeof value === 'number') {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        return this.succeed(parsed, context);
      }
    }

    return this.fail('date.type', context);
  }

  // -------------------------------------------------------------------------
  // Range Validators
  // -------------------------------------------------------------------------

  /** Minimum date (inclusive) */
  min(minDate: Date | string, options?: ValidationOptions): this {
    const date = minDate instanceof Date ? minDate : new Date(minDate);
    return this.addStrategy(new MinDateStrategy(date, options));
  }

  /** Maximum date (inclusive) */
  max(maxDate: Date | string, options?: ValidationOptions): this {
    const date = maxDate instanceof Date ? maxDate : new Date(maxDate);
    return this.addStrategy(new MaxDateStrategy(date, options));
  }

  /** Date must be within range (inclusive) */
  range(minDate: Date | string, maxDate: Date | string, options?: ValidationOptions): this {
    return this.min(minDate, options).max(maxDate, options);
  }

  /** Alias for range */
  between(minDate: Date | string, maxDate: Date | string, options?: ValidationOptions): this {
    return this.range(minDate, maxDate, options);
  }

  // -------------------------------------------------------------------------
  // Comparison Validators
  // -------------------------------------------------------------------------

  /** Must be before the given date (exclusive) */
  before(date: Date | string, options?: ValidationOptions): this {
    const d = date instanceof Date ? date : new Date(date);
    return this.addStrategy(new IsBeforeStrategy(d, options));
  }

  /** Alias for before */
  isBefore(date: Date | string, options?: ValidationOptions): this {
    return this.before(date, options);
  }

  /** Must be after the given date (exclusive) */
  after(date: Date | string, options?: ValidationOptions): this {
    const d = date instanceof Date ? date : new Date(date);
    return this.addStrategy(new IsAfterStrategy(d, options));
  }

  /** Alias for after */
  isAfter(date: Date | string, options?: ValidationOptions): this {
    return this.after(date, options);
  }

  // -------------------------------------------------------------------------
  // Temporal Validators
  // -------------------------------------------------------------------------

  /** Must be in the past */
  past(options?: ValidationOptions): this {
    return this.addStrategy(new IsPastStrategy(options));
  }

  /** Alias for past */
  isPast(options?: ValidationOptions): this {
    return this.past(options);
  }

  /** Must be in the future */
  future(options?: ValidationOptions): this {
    return this.addStrategy(new IsFutureStrategy(options));
  }

  /** Alias for future */
  isFuture(options?: ValidationOptions): this {
    return this.future(options);
  }

  /** Must be today */
  today(options?: ValidationOptions): this {
    return this.addStrategy(new IsTodayStrategy(options));
  }

  /** Alias for today */
  isToday(options?: ValidationOptions): this {
    return this.today(options);
  }

  // -------------------------------------------------------------------------
  // Day of Week Validators
  // -------------------------------------------------------------------------

  /** Must be a weekday (Monday-Friday) */
  weekday(options?: ValidationOptions): this {
    return this.addStrategy(new IsWeekdayStrategy(options));
  }

  /** Alias for weekday */
  isWeekday(options?: ValidationOptions): this {
    return this.weekday(options);
  }

  /** Must be a weekend (Saturday-Sunday) */
  weekend(options?: ValidationOptions): this {
    return this.addStrategy(new IsWeekendStrategy(options));
  }

  /** Alias for weekend */
  isWeekend(options?: ValidationOptions): this {
    return this.weekend(options);
  }

  // -------------------------------------------------------------------------
  // Age Validators
  // -------------------------------------------------------------------------

  /** Minimum age in years (for birthdate validation) */
  minAge(years: number, options?: ValidationOptions): this {
    return this.addStrategy(new MinAgeStrategy(years, options));
  }

  /** Maximum age in years (for birthdate validation) */
  maxAge(years: number, options?: ValidationOptions): this {
    return this.addStrategy(new MaxAgeStrategy(years, options));
  }

  /** Age must be within range (for birthdate validation) */
  ageRange(minYears: number, maxYears: number, options?: ValidationOptions): this {
    return this.minAge(minYears, options).maxAge(maxYears, options);
  }
}

/**
 * Create a new date validator
 * @returns New DateValidator instance
 */
export function date(): DateValidator {
  return new DateValidator();
}
