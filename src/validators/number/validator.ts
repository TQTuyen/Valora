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
    return this.addStrategy(new MinStrategy(minimum, options));
  }

  /** Maximum value (inclusive) */
  max(maximum: number, options?: ValidationOptions): this {
    return this.addStrategy(new MaxStrategy(maximum, options));
  }

  /** Value must be within range (inclusive) */
  range(min: number, max: number, options?: ValidationOptions): this {
    return this.min(min, options).max(max, options);
  }

  /** Alias for range */
  between(min: number, max: number, options?: ValidationOptions): this {
    return this.range(min, max, options);
  }

  // -------------------------------------------------------------------------
  // Type Validators
  // -------------------------------------------------------------------------

  /** Must be an integer */
  integer(options?: ValidationOptions): this {
    return this.addStrategy(new IntegerStrategy(options));
  }

  /** Alias for integer */
  int(options?: ValidationOptions): this {
    return this.integer(options);
  }

  /** Must be a finite number */
  finite(options?: ValidationOptions): this {
    return this.addStrategy(new FiniteStrategy(options));
  }

  /** Must be a safe integer */
  safe(options?: ValidationOptions): this {
    return this.addStrategy(new SafeIntegerStrategy(options));
  }

  /** Alias for safe */
  safeInteger(options?: ValidationOptions): this {
    return this.safe(options);
  }

  // -------------------------------------------------------------------------
  // Sign Validators
  // -------------------------------------------------------------------------

  /** Must be positive (> 0) */
  positive(options?: ValidationOptions): this {
    return this.addStrategy(new PositiveStrategy(options));
  }

  /** Must be negative (< 0) */
  negative(options?: ValidationOptions): this {
    return this.addStrategy(new NegativeStrategy(options));
  }

  /** Must be non-negative (>= 0) */
  nonNegative(options?: ValidationOptions): this {
    return this.addStrategy(new NonNegativeStrategy(options));
  }

  /** Alias for nonNegative */
  nonnegative(options?: ValidationOptions): this {
    return this.nonNegative(options);
  }

  /** Must be non-positive (<= 0) */
  nonPositive(options?: ValidationOptions): this {
    return this.addStrategy(new NonPositiveStrategy(options));
  }

  /** Alias for nonPositive */
  nonpositive(options?: ValidationOptions): this {
    return this.nonPositive(options);
  }

  // -------------------------------------------------------------------------
  // Divisibility Validators
  // -------------------------------------------------------------------------

  /** Must be a multiple of the given factor */
  multipleOf(factor: number, options?: ValidationOptions): this {
    return this.addStrategy(new MultipleOfStrategy(factor, options));
  }

  /** Alias for multipleOf */
  step(factor: number, options?: ValidationOptions): this {
    return this.multipleOf(factor, options);
  }
}

/**
 * Create a new number validator
 * @returns New NumberValidator instance
 */
export function number(): NumberValidator {
  return new NumberValidator();
}
