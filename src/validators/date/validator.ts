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

import type { ValidationContext, ValidationResult } from '#types/index';

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
  min(minDate: Date | string): this {
    const date = minDate instanceof Date ? minDate : new Date(minDate);
    return this.addStrategy(new MinDateStrategy(date));
  }

  /** Maximum date (inclusive) */
  max(maxDate: Date | string): this {
    const date = maxDate instanceof Date ? maxDate : new Date(maxDate);
    return this.addStrategy(new MaxDateStrategy(date));
  }

  /** Date must be within range (inclusive) */
  range(minDate: Date | string, maxDate: Date | string): this {
    return this.min(minDate).max(maxDate);
  }

  /** Alias for range */
  between(minDate: Date | string, maxDate: Date | string): this {
    return this.range(minDate, maxDate);
  }

  // -------------------------------------------------------------------------
  // Comparison Validators
  // -------------------------------------------------------------------------

  /** Must be before the given date (exclusive) */
  before(date: Date | string): this {
    const d = date instanceof Date ? date : new Date(date);
    return this.addStrategy(new IsBeforeStrategy(d));
  }

  /** Alias for before */
  isBefore(date: Date | string): this {
    return this.before(date);
  }

  /** Must be after the given date (exclusive) */
  after(date: Date | string): this {
    const d = date instanceof Date ? date : new Date(date);
    return this.addStrategy(new IsAfterStrategy(d));
  }

  /** Alias for after */
  isAfter(date: Date | string): this {
    return this.after(date);
  }

  // -------------------------------------------------------------------------
  // Temporal Validators
  // -------------------------------------------------------------------------

  /** Must be in the past */
  past(): this {
    return this.addStrategy(new IsPastStrategy());
  }

  /** Alias for past */
  isPast(): this {
    return this.past();
  }

  /** Must be in the future */
  future(): this {
    return this.addStrategy(new IsFutureStrategy());
  }

  /** Alias for future */
  isFuture(): this {
    return this.future();
  }

  /** Must be today */
  today(): this {
    return this.addStrategy(new IsTodayStrategy());
  }

  /** Alias for today */
  isToday(): this {
    return this.today();
  }

  // -------------------------------------------------------------------------
  // Day of Week Validators
  // -------------------------------------------------------------------------

  /** Must be a weekday (Monday-Friday) */
  weekday(): this {
    return this.addStrategy(new IsWeekdayStrategy());
  }

  /** Alias for weekday */
  isWeekday(): this {
    return this.weekday();
  }

  /** Must be a weekend (Saturday-Sunday) */
  weekend(): this {
    return this.addStrategy(new IsWeekendStrategy());
  }

  /** Alias for weekend */
  isWeekend(): this {
    return this.weekend();
  }

  // -------------------------------------------------------------------------
  // Age Validators
  // -------------------------------------------------------------------------

  /** Minimum age in years (for birthdate validation) */
  minAge(years: number): this {
    return this.addStrategy(new MinAgeStrategy(years));
  }

  /** Maximum age in years (for birthdate validation) */
  maxAge(years: number): this {
    return this.addStrategy(new MaxAgeStrategy(years));
  }

  /** Age must be within range (for birthdate validation) */
  ageRange(minYears: number, maxYears: number): this {
    return this.minAge(minYears).maxAge(maxYears);
  }
}

/**
 * Create a new date validator
 * @returns New DateValidator instance
 */
export function date(): DateValidator {
  return new DateValidator();
}
