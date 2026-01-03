/**
 * Comparison Validator
 * @module validators/comparison/validator
 */

import { BaseValidator } from '@validators/common/index';

import {
  BetweenStrategy,
  DifferentFromStrategy,
  EqualToStrategy,
  GreaterThanOrEqualStrategy,
  GreaterThanStrategy,
  LessThanOrEqualStrategy,
  LessThanStrategy,
  NotEqualToStrategy,
  NotOneOfStrategy,
  OneOfValueStrategy,
  SameAsStrategy,
} from './strategies';

import type { FieldRef } from './strategies';
import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/**
 * Create a field reference for cross-field validation
 * @param path - Path to the referenced field (e.g., 'password', 'address.city')
 */
export function ref(path: string): FieldRef {
  return { $ref: path };
}

/**
 * Comparison validator with fluent API
 *
 * @example
 * ```typescript
 * // Compare with literal value
 * const statusValidator = compare<string>()
 *   .oneOf(['active', 'inactive', 'pending']);
 *
 * // Compare with another field
 * const confirmPasswordValidator = compare<string>()
 *   .sameAs('password');
 * ```
 */
export class ComparisonValidator<T> extends BaseValidator<T, T> {
  readonly _type = 'comparison';

  protected clone(): ComparisonValidator<T> {
    const cloned = new ComparisonValidator<T>();
    cloned.strategies = [...this.strategies];
    cloned.isRequired = this.isRequired;
    if (this.customMessage !== undefined) {
      cloned.customMessage = this.customMessage;
    }
    return cloned;
  }

  protected override checkType(value: T, context: ValidationContext): ValidationResult<T> {
    // Comparison validators don't check type, they assume correct type
    return this.succeed(value, context);
  }

  // -------------------------------------------------------------------------
  // Equality Comparisons
  // -------------------------------------------------------------------------

  /** Must equal a value or field */
  equalTo(value: T | FieldRef, options?: ValidationOptions): this {
    return this.addStrategy(new EqualToStrategy(value, options) as never);
  }

  /** Alias for equalTo */
  equals(value: T | FieldRef, options?: ValidationOptions): this {
    return this.equalTo(value, options);
  }

  /** Alias for equalTo */
  eq(value: T | FieldRef, options?: ValidationOptions): this {
    return this.equalTo(value, options);
  }

  /** Must not equal a value or field */
  notEqualTo(value: T | FieldRef, options?: ValidationOptions): this {
    return this.addStrategy(new NotEqualToStrategy(value, options) as never);
  }

  /** Alias for notEqualTo */
  notEquals(value: T | FieldRef, options?: ValidationOptions): this {
    return this.notEqualTo(value, options);
  }

  /** Alias for notEqualTo */
  neq(value: T | FieldRef, options?: ValidationOptions): this {
    return this.notEqualTo(value, options);
  }

  // -------------------------------------------------------------------------
  // Numeric/Date Comparisons
  // -------------------------------------------------------------------------

  /** Must be greater than a value or field */
  greaterThan(value: (T & (number | Date)) | FieldRef, options?: ValidationOptions): this {
    return this.addStrategy(
      new GreaterThanStrategy(value as number | Date | FieldRef, options) as never,
    );
  }

  /** Alias for greaterThan */
  gt(value: (T & (number | Date)) | FieldRef, options?: ValidationOptions): this {
    return this.greaterThan(value, options);
  }

  /** Must be greater than or equal to a value or field */
  greaterThanOrEqual(value: (T & (number | Date)) | FieldRef, options?: ValidationOptions): this {
    return this.addStrategy(
      new GreaterThanOrEqualStrategy(value as number | Date | FieldRef, options) as never,
    );
  }

  /** Alias for greaterThanOrEqual */
  gte(value: (T & (number | Date)) | FieldRef, options?: ValidationOptions): this {
    return this.greaterThanOrEqual(value, options);
  }

  /** Must be less than a value or field */
  lessThan(value: (T & (number | Date)) | FieldRef, options?: ValidationOptions): this {
    return this.addStrategy(
      new LessThanStrategy(value as number | Date | FieldRef, options) as never,
    );
  }

  /** Alias for lessThan */
  lt(value: (T & (number | Date)) | FieldRef, options?: ValidationOptions): this {
    return this.lessThan(value, options);
  }

  /** Must be less than or equal to a value or field */
  lessThanOrEqual(value: (T & (number | Date)) | FieldRef, options?: ValidationOptions): this {
    return this.addStrategy(
      new LessThanOrEqualStrategy(value as number | Date | FieldRef, options) as never,
    );
  }

  /** Alias for lessThanOrEqual */
  lte(value: (T & (number | Date)) | FieldRef, options?: ValidationOptions): this {
    return this.lessThanOrEqual(value, options);
  }

  /** Must be between min and max (inclusive) */
  between(
    min: (T & (number | Date)) | FieldRef,
    max: (T & (number | Date)) | FieldRef,
    options?: ValidationOptions,
  ): this {
    return this.addStrategy(
      new BetweenStrategy(
        min as number | Date | FieldRef,
        max as number | Date | FieldRef,
        options,
      ) as never,
    );
  }

  // -------------------------------------------------------------------------
  // Enum Comparisons
  // -------------------------------------------------------------------------

  /** Must be one of the allowed values */
  oneOf(values: T[], options?: ValidationOptions): this {
    return this.addStrategy(new OneOfValueStrategy(values, options) as never);
  }

  /** Alias for oneOf */
  in(values: T[], options?: ValidationOptions): this {
    return this.oneOf(values, options);
  }

  /** Alias for oneOf */
  enum(values: T[], options?: ValidationOptions): this {
    return this.oneOf(values, options);
  }

  /** Must not be one of the forbidden values */
  notOneOf(values: T[], options?: ValidationOptions): this {
    return this.addStrategy(new NotOneOfStrategy(values, options) as never);
  }

  /** Alias for notOneOf */
  notIn(values: T[], options?: ValidationOptions): this {
    return this.notOneOf(values, options);
  }

  // -------------------------------------------------------------------------
  // Cross-Field Comparisons
  // -------------------------------------------------------------------------

  /** Must be same as another field */
  sameAs(fieldPath: string, options?: ValidationOptions): this {
    return this.addStrategy(new SameAsStrategy(fieldPath, options) as never);
  }

  /** Alias for sameAs */
  matches(fieldPath: string, options?: ValidationOptions): this {
    return this.sameAs(fieldPath, options);
  }

  /** Must be different from another field */
  differentFrom(fieldPath: string, options?: ValidationOptions): this {
    return this.addStrategy(new DifferentFromStrategy(fieldPath, options) as never);
  }

  /** Alias for differentFrom */
  notSameAs(fieldPath: string, options?: ValidationOptions): this {
    return this.differentFrom(fieldPath, options);
  }
}

/**
 * Create a new comparison validator
 * @returns New ComparisonValidator instance
 */
export function compare<T>(): ComparisonValidator<T> {
  return new ComparisonValidator<T>();
}

/**
 * Create a literal/constant validator - value must exactly equal the specified literal
 * @param value - The literal value that must match
 * @param options - Validation options
 */
export function literal<T extends string | number | boolean>(
  value: T,
  options?: ValidationOptions,
): ComparisonValidator<T> {
  return new ComparisonValidator<T>().equalTo(value, options);
}

/**
 * Create an enum validator from an object's values
 * @param enumObj - Enum object or record
 * @param options - Validation options
 */
export function nativeEnum<T extends Record<string, string | number>>(
  enumObj: T,
  options?: ValidationOptions,
): ComparisonValidator<T[keyof T]> {
  const values = Object.values(enumObj) as T[keyof T][];
  return new ComparisonValidator<T[keyof T]>().oneOf(values, options);
}
