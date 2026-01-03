/**
 * String Validator
 * @module validators/string/validator
 */

import { BaseValidator } from '@validators/common/index';

import {
  AlphanumericStrategy,
  AlphaStrategy,
  ContainsStrategy,
  EmailStrategy,
  EndsWithStrategy,
  LengthStrategy,
  LowercaseStrategy,
  MaxLengthStrategy,
  MinLengthStrategy,
  NotEmptyStrategy,
  NumericStrategy,
  PatternStrategy,
  StartsWithStrategy,
  UppercaseStrategy,
  UrlStrategy,
  UuidStrategy,
} from './strategies';

import type { ValidationContext, ValidationResult } from '#types/index';

/**
 * String validator with fluent API
 *
 * @example
 * ```typescript
 * const emailValidator = new StringValidator()
 *   .required()
 *   .email()
 *   .maxLength(255);
 *
 * const result = emailValidator.validate('user@example.com');
 * ```
 */
export class StringValidator extends BaseValidator<unknown, string> {
  readonly _type: string = 'string';

  protected clone(): StringValidator {
    const cloned = new StringValidator();
    cloned.strategies = [...this.strategies];
    cloned.isRequired = this.isRequired;
    if (this.customMessage) {
      cloned.customMessage = this.customMessage;
    }
    return cloned;
  }

  protected override checkType(
    value: unknown,
    context: ValidationContext,
  ): ValidationResult<string> {
    if (typeof value !== 'string') {
      return this.fail('string.type', context);
    }
    return this.succeed(value, context);
  }

  // -------------------------------------------------------------------------
  // Format Validators
  // -------------------------------------------------------------------------

  /** Validate as email address */
  email(): this {
    return this.addStrategy(new EmailStrategy());
  }

  /** Validate as URL */
  url(): this {
    return this.addStrategy(new UrlStrategy());
  }

  /** Validate as UUID v4 */
  uuid(): this {
    return this.addStrategy(new UuidStrategy());
  }

  // -------------------------------------------------------------------------
  // Length Validators
  // -------------------------------------------------------------------------

  /** Minimum string length */
  minLength(min: number, options?: { message?: string }): this {
    return this.addStrategy(new MinLengthStrategy(min, options?.message));
  }

  /** Alias for minLength */
  min(min: number): this {
    return this.minLength(min);
  }

  /** Maximum string length */
  maxLength(max: number): this {
    return this.addStrategy(new MaxLengthStrategy(max));
  }

  /** Alias for maxLength */
  max(max: number): this {
    return this.maxLength(max);
  }

  /** Exact string length */
  length(len: number): this {
    return this.addStrategy(new LengthStrategy(len));
  }

  // -------------------------------------------------------------------------
  // Pattern Validators
  // -------------------------------------------------------------------------

  /** Match a regex pattern */
  matches(pattern: RegExp, message?: string): this {
    return this.addStrategy(new PatternStrategy(pattern, message));
  }

  /** Alias for matches */
  pattern(pattern: RegExp, message?: string): this {
    return this.matches(pattern, message);
  }

  /** Alias for matches */
  regex(pattern: RegExp, message?: string): this {
    return this.matches(pattern, message);
  }

  // -------------------------------------------------------------------------
  // Content Validators
  // -------------------------------------------------------------------------

  /** String must start with a prefix */
  startsWith(prefix: string): this {
    return this.addStrategy(new StartsWithStrategy(prefix));
  }

  /** String must end with a suffix */
  endsWith(suffix: string): this {
    return this.addStrategy(new EndsWithStrategy(suffix));
  }

  /** String must contain a substring */
  contains(substring: string): this {
    return this.addStrategy(new ContainsStrategy(substring));
  }

  /** Alias for contains */
  includes(substring: string): this {
    return this.contains(substring);
  }

  // -------------------------------------------------------------------------
  // Character Set Validators
  // -------------------------------------------------------------------------

  /** Must contain only letters (a-z, A-Z) */
  alpha(): this {
    return this.addStrategy(new AlphaStrategy());
  }

  /** Must contain only letters and numbers */
  alphanumeric(): this {
    return this.addStrategy(new AlphanumericStrategy());
  }

  /** Alias for alphanumeric */
  alphanum(): this {
    return this.alphanumeric();
  }

  /** Must contain only numeric characters */
  numeric(): this {
    return this.addStrategy(new NumericStrategy());
  }

  // -------------------------------------------------------------------------
  // Case Validators
  // -------------------------------------------------------------------------

  /** Must be all lowercase */
  lowercase(): this {
    return this.addStrategy(new LowercaseStrategy());
  }

  /** Must be all uppercase */
  uppercase(): this {
    return this.addStrategy(new UppercaseStrategy());
  }

  // -------------------------------------------------------------------------
  // Empty/Whitespace Validators
  // -------------------------------------------------------------------------

  /** Must not be empty or whitespace only */
  notEmpty(): this {
    return this.addStrategy(new NotEmptyStrategy());
  }

  /** Alias for notEmpty */
  nonempty(): this {
    return this.notEmpty();
  }

  // -------------------------------------------------------------------------
  // Transformers
  // -------------------------------------------------------------------------

  /** Trim whitespace from both ends */
  trim(): this {
    return this.transform((s) => s.trim()) as unknown as this;
  }

  /** Convert to lowercase */
  toLowerCase(): this {
    return this.transform((s) => s.toLowerCase()) as unknown as this;
  }

  /** Convert to uppercase */
  toUpperCase(): this {
    return this.transform((s) => s.toUpperCase()) as unknown as this;
  }
}

/**
 * Create a new string validator
 * @returns New StringValidator instance
 */
export function string(): StringValidator {
  return new StringValidator();
}
