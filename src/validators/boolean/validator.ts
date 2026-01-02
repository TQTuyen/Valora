/**
 * Boolean Validator
 * @module validators/boolean/validator
 */

import { BaseValidator } from '@validators/common/index';

import { IsFalseStrategy, IsTrueStrategy } from './strategies';

import type { ValidationContext, ValidationResult } from '#types/index';

/**
 * Boolean validator with fluent API
 *
 * @example
 * ```typescript
 * const acceptedValidator = new BooleanValidator()
 *   .required()
 *   .isTrue();
 *
 * const result = acceptedValidator.validate(true);
 * ```
 */
export class BooleanValidator extends BaseValidator<unknown, boolean> {
  readonly _type = 'boolean';

  protected clone(): BooleanValidator {
    const cloned = new BooleanValidator();
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
  ): ValidationResult<boolean> {
    if (typeof value !== 'boolean') {
      return this.fail('boolean.type', context);
    }
    return this.succeed(value, context);
  }

  /** Must be true */
  isTrue(options?: { message?: string }): this {
    return this.addStrategy(new IsTrueStrategy(options?.message));
  }

  /** Alias for isTrue */
  true(): this {
    return this.isTrue();
  }

  /** Must be false */
  isFalse(options?: { message?: string }): this {
    return this.addStrategy(new IsFalseStrategy(options?.message));
  }

  /** Alias for isFalse */
  false(): this {
    return this.isFalse();
  }
}

/**
 * Create a new boolean validator
 * @returns New BooleanValidator instance
 */
export function boolean(): BooleanValidator {
  return new BooleanValidator();
}
