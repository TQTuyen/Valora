/**
 * Array Validator
 * @module validators/array/validator
 */

import { BaseValidator } from '@validators/common/index';

import {
  ContainsStrategy,
  EveryStrategy,
  ExactLengthArrayStrategy,
  ItemValidatorStrategy,
  MaxLengthArrayStrategy,
  MinLengthArrayStrategy,
  NonEmptyArrayStrategy,
  SomeStrategy,
  UniqueArrayStrategy,
} from './strategies';

import type {
  IValidator,
  ValidationContext,
  ValidationOptions,
  ValidationResult,
} from '#types/index';

/**
 * Array validator with fluent API
 *
 * @example
 * ```typescript
 * const tagsValidator = new ArrayValidator<string>()
 *   .required()
 *   .minLength(1)
 *   .maxLength(10)
 *   .unique();
 *
 * const result = tagsValidator.validate(['tag1', 'tag2']);
 * ```
 */
export class ArrayValidator<T = unknown, U = T> extends BaseValidator<unknown, U[]> {
  readonly _type = 'array';
  private itemValidator?: IValidator<T, U>;

  protected clone(): ArrayValidator<T, U> {
    const cloned = new ArrayValidator<T, U>();
    cloned.strategies = [...this.strategies];
    cloned.isRequired = this.isRequired;
    if (this.customMessage !== undefined) {
      cloned.customMessage = this.customMessage;
    }
    if (this.itemValidator !== undefined) {
      cloned.itemValidator = this.itemValidator;
    }
    return cloned;
  }

  protected override checkType(value: unknown, context: ValidationContext): ValidationResult<U[]> {
    if (!Array.isArray(value)) {
      return this.fail('array.type', context);
    }
    return this.succeed(value as U[], context);
  }

  // -------------------------------------------------------------------------
  // Item Validation
  // -------------------------------------------------------------------------

  /**
   * Set the validator for each item in the array
   * @param validator - Validator to apply to each item
   */
  of<NewT, NewU>(validator: IValidator<NewT, NewU>): ArrayValidator<NewT, NewU> {
    const cloned = new ArrayValidator<NewT, NewU>();
    cloned.strategies = [];
    cloned.isRequired = this.isRequired;
    if (this.customMessage !== undefined) {
      cloned.customMessage = this.customMessage;
    }
    cloned.itemValidator = validator;
    cloned.strategies.push(new ItemValidatorStrategy<NewT, NewU>(validator) as never);
    return cloned;
  }

  /** Alias for of */
  items<NewT, NewU>(validator: IValidator<NewT, NewU>): ArrayValidator<NewT, NewU> {
    return this.of(validator);
  }

  // -------------------------------------------------------------------------
  // Length Validators
  // -------------------------------------------------------------------------

  /** Minimum array length */
  min(minLength: number, options?: ValidationOptions): this {
    return this.addStrategy(new MinLengthArrayStrategy(minLength, options) as never);
  }

  /** Alias for min */
  minLength(minLength: number, options?: ValidationOptions): this {
    return this.min(minLength, options);
  }

  /** Maximum array length */
  max(maxLength: number, options?: ValidationOptions): this {
    return this.addStrategy(new MaxLengthArrayStrategy(maxLength, options) as never);
  }

  /** Alias for max */
  maxLength(maxLength: number, options?: ValidationOptions): this {
    return this.max(maxLength, options);
  }

  /** Exact array length */
  length(exactLength: number, options?: ValidationOptions): this {
    return this.addStrategy(new ExactLengthArrayStrategy(exactLength, options) as never);
  }

  /** Length must be in range */
  range(minLength: number, maxLength: number, options?: ValidationOptions): this {
    return this.min(minLength, options).max(maxLength, options);
  }

  /** Alias for range */
  between(minLength: number, maxLength: number, options?: ValidationOptions): this {
    return this.range(minLength, maxLength, options);
  }

  // -------------------------------------------------------------------------
  // Content Validators
  // -------------------------------------------------------------------------

  /** Array must not be empty */
  nonEmpty(options?: ValidationOptions): this {
    return this.addStrategy(new NonEmptyArrayStrategy(options) as never);
  }

  /** Alias for nonEmpty */
  notEmpty(options?: ValidationOptions): this {
    return this.nonEmpty(options);
  }

  /** All items must be unique */
  unique(options?: ValidationOptions): this {
    return this.addStrategy(new UniqueArrayStrategy(options) as never);
  }

  /** Alias for unique */
  distinct(options?: ValidationOptions): this {
    return this.unique(options);
  }

  /** Array must contain a specific value */
  contains(value: U, options?: ValidationOptions): this {
    return this.addStrategy(new ContainsStrategy(value, options) as never);
  }

  /** Alias for contains */
  includes(value: U, options?: ValidationOptions): this {
    return this.contains(value, options);
  }

  // -------------------------------------------------------------------------
  // Predicate Validators
  // -------------------------------------------------------------------------

  /** Every item must satisfy the predicate */
  every(predicate: (item: U, index: number) => boolean, options?: ValidationOptions): this {
    return this.addStrategy(new EveryStrategy(predicate, options) as never);
  }

  /** At least one item must satisfy the predicate */
  some(predicate: (item: U, index: number) => boolean, options?: ValidationOptions): this {
    return this.addStrategy(new SomeStrategy(predicate, options) as never);
  }

  /** None of the items should satisfy the predicate */
  none(predicate: (item: U, index: number) => boolean, options?: ValidationOptions): this {
    return this.every((item, index) => !predicate(item, index), options);
  }
}

/**
 * Create a new array validator
 * @returns New ArrayValidator instance
 */
export function array<T = unknown, U = T>(): ArrayValidator<T, U> {
  return new ArrayValidator<T, U>();
}
