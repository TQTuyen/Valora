/**
 * Number Validator
 * @module validators/number/validator
 */

import { BaseValidator } from '@validators/common/index';

import {
  FiniteStrategy,
  IntegerStrategy,
  MaxStrategy,
  MinStrategy,
  MultipleOfStrategy,
  NegativeStrategy,
  NonNegativeStrategy,
  NonPositiveStrategy,
  PositiveStrategy,
  SafeIntegerStrategy,
} from './strategies';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/**
 * Number validator with fluent API
 *
 * @example
 * ```typescript
 * const ageValidator = new NumberValidator()
 *   .required()
 *   .integer()
 *   .positive()
 *   .max(150);
 *
 * const result = ageValidator.validate(25);
 * ```
 */
export class NumberValidator extends BaseValidator<unknown, number> {
  readonly _type = 'number';

  protected clone(): NumberValidator {
    const cloned = new NumberValidator();
    cloned.strategies = [...this.strategies];
    cloned.isRequired = this.isRequired;
    if (this.customMessage !== undefined) {
      cloned.customMessage = this.customMessage;
    }
    return cloned;
  }

  protected override checkType(
    value: unknown,
    context: ValidationContext,
  ): ValidationResult<number> {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return this.fail('number.type', context);
    }
    return this.succeed(value, context);
  }

  // -------------------------------------------------------------------------
  // Range Validators
  // -------------------------------------------------------------------------

  /** Minimum value (inclusive) */
  min(minimum: number, options?: ValidationOptions): this {
    const strategy = new MinStrategy(minimum);
    if (options?.message) strategy.withMessage(options.message);
    return this.addStrategy(strategy);
  }

  /** Maximum value (inclusive) */
  max(maximum: number, options?: ValidationOptions): this {
    const strategy = new MaxStrategy(maximum);
    if (options?.message) strategy.withMessage(options.message);
    return this.addStrategy(strategy);
  }

  /** Value must be within range (inclusive) */
  range(min: number, max: number): this {
    return this.min(min).max(max);
  }

  /** Alias for range */
  between(min: number, max: number): this {
    return this.range(min, max);
  }

  // -------------------------------------------------------------------------
  // Type Validators
  // -------------------------------------------------------------------------

  /** Must be an integer */
  integer(options?: ValidationOptions): this {
    const strategy = new IntegerStrategy();
    if (options?.message) strategy.withMessage(options.message);
    return this.addStrategy(strategy);
  }

  /** Alias for integer */
  int(): this {
    return this.integer();
  }

  /** Must be a finite number */
  finite(options?: ValidationOptions): this {
    const strategy = new FiniteStrategy();
    if (options?.message) strategy.withMessage(options.message);
    return this.addStrategy(strategy);
  }

  /** Must be a safe integer */
  safe(options?: ValidationOptions): this {
    const strategy = new SafeIntegerStrategy();
    if (options?.message) strategy.withMessage(options.message);
    return this.addStrategy(strategy);
  }

  /** Alias for safe */
  safeInteger(): this {
    return this.safe();
  }

  // -------------------------------------------------------------------------
  // Sign Validators
  // -------------------------------------------------------------------------

  /** Must be positive (> 0) */
  positive(options?: ValidationOptions): this {
    const strategy = new PositiveStrategy();
    if (options?.message) strategy.withMessage(options.message);
    return this.addStrategy(strategy);
  }

  /** Must be negative (< 0) */
  negative(options?: ValidationOptions): this {
    const strategy = new NegativeStrategy();
    if (options?.message) strategy.withMessage(options.message);
    return this.addStrategy(strategy);
  }

  /** Must be non-negative (>= 0) */
  nonNegative(): this {
    return this.addStrategy(new NonNegativeStrategy());
  }

  /** Alias for nonNegative */
  nonnegative(): this {
    return this.nonNegative();
  }

  /** Must be non-positive (<= 0) */
  nonPositive(): this {
    return this.addStrategy(new NonPositiveStrategy());
  }

  /** Alias for nonPositive */
  nonpositive(): this {
    return this.nonPositive();
  }

  // -------------------------------------------------------------------------
  // Divisibility Validators
  // -------------------------------------------------------------------------

  /** Must be a multiple of the given factor */
  multipleOf(factor: number, options?: ValidationOptions): this {
    const strategy = new MultipleOfStrategy(factor);
    if (options?.message) strategy.withMessage(options.message);
    return this.addStrategy(strategy);
  }

  /** Alias for multipleOf */
  step(factor: number): this {
    return this.multipleOf(factor);
  }
}

/**
 * Create a new number validator
 * @returns New NumberValidator instance
 */
export function number(): NumberValidator {
  return new NumberValidator();
}
