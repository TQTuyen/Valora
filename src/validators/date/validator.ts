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
    const strategy = new MinDateStrategy(date);
    if (options?.message) strategy.withMessage(options.message);
    return this.addStrategy(strategy);
  }

  /** Maximum date (inclusive) */
  max(maxDate: Date | string, options?: ValidationOptions): this {
    const date = maxDate instanceof Date ? maxDate : new Date(maxDate);
    const strategy = new MaxDateStrategy(date);
    if (options?.message) strategy.withMessage(options.message);
    return this.addStrategy(strategy);
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
  before(date: Date | string, options?: ValidationOptions): this {
    const d = date instanceof Date ? date : new Date(date);
    const strategy = new IsBeforeStrategy(d);
    if (options?.message) strategy.withMessage(options.message);
    return this.addStrategy(strategy);
  }

  /** Alias for before */
  isBefore(date: Date | string, options?: ValidationOptions): this {
    return this.before(date, options);
  }

  /** Must be after the given date (exclusive) */
  after(date: Date | string, options?: ValidationOptions): this {
    const d = date instanceof Date ? date : new Date(date);
    const strategy = new IsAfterStrategy(d);
    if (options?.message) strategy.withMessage(options.message);
    return this.addStrategy(strategy);
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
    const strategy = new IsPastStrategy();
    if (options?.message) strategy.withMessage(options.message);
    return this.addStrategy(strategy);
  }

  /** Alias for past */
  isPast(): this {
    return this.past();
  }

  /** Must be in the future */
  future(options?: ValidationOptions): this {
    const strategy = new IsFutureStrategy();
    if (options?.message) strategy.withMessage(options.message);
    return this.addStrategy(strategy);
  }

  /** Alias for future */
  isFuture(): this {
    return this.future();
  }

  /** Must be today */
  today(options?: ValidationOptions): this {
    const strategy = new IsTodayStrategy();
    if (options?.message) strategy.withMessage(options.message);
    return this.addStrategy(strategy);
  }

  /** Alias for today */
  isToday(): this {
    return this.today();
  }

  // -------------------------------------------------------------------------
  // Day of Week Validators
  // -------------------------------------------------------------------------

  /** Must be a weekday (Monday-Friday) */
  weekday(options?: ValidationOptions): this {
    const strategy = new IsWeekdayStrategy();
    if (options?.message) strategy.withMessage(options.message);
    return this.addStrategy(strategy);
  }

  /** Alias for weekday */
  isWeekday(): this {
    return this.weekday();
  }

  /** Must be a weekend (Saturday-Sunday) */
  weekend(options?: ValidationOptions): this {
    const strategy = new IsWeekendStrategy();
    if (options?.message) strategy.withMessage(options.message);
    return this.addStrategy(strategy);
  }

  /** Alias for weekend */
  isWeekend(): this {
    return this.weekend();
  }

  // -------------------------------------------------------------------------
  // Age Validators
  // -------------------------------------------------------------------------

  /** Minimum age in years (for birthdate validation) */
  minAge(years: number, options?: ValidationOptions): this {
    const strategy = new MinAgeStrategy(years);
    if (options?.message) strategy.withMessage(options.message);
    return this.addStrategy(strategy);
  }

  /** Maximum age in years (for birthdate validation) */
  maxAge(years: number, options?: ValidationOptions): this {
    const strategy = new MaxAgeStrategy(years);
    if (options?.message) strategy.withMessage(options.message);
    return this.addStrategy(strategy);
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
