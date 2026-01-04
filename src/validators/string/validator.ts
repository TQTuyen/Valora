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

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

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
    // Allow undefined/null to pass through - will be caught by required() if needed
    if (value === undefined || value === null) {
      return this.succeed(value as string, context);
    }
    if (typeof value !== 'string') {
      return this.fail('string.type', context);
    }
    return this.succeed(value, context);
  }

  // -------------------------------------------------------------------------
  // Format Validators
  // -------------------------------------------------------------------------

  /** Validate as email address */
  email(options?: ValidationOptions): this {
    return this.addStrategy(new EmailStrategy(options));
  }

  /** Validate as URL */
  url(options?: ValidationOptions): this {
    return this.addStrategy(new UrlStrategy(options));
  }

  /** Validate as UUID v4 */
  uuid(options?: ValidationOptions): this {
    return this.addStrategy(new UuidStrategy(options));
  }

  // -------------------------------------------------------------------------
  // Length Validators
  // -------------------------------------------------------------------------

  /** Minimum string length */
  minLength(min: number, options?: ValidationOptions): this {
    return this.addStrategy(new MinLengthStrategy(min, options));
  }

  /** Alias for minLength */
  min(min: number, options?: ValidationOptions): this {
    return this.minLength(min, options);
  }

  /** Maximum string length */
  maxLength(max: number, options?: ValidationOptions): this {
    return this.addStrategy(new MaxLengthStrategy(max, options));
  }

  /** Alias for maxLength */
  max(max: number, options?: ValidationOptions): this {
    return this.maxLength(max, options);
  }

  /** Exact string length */
  length(len: number, options?: ValidationOptions): this {
    return this.addStrategy(new LengthStrategy(len, options));
  }

  // -------------------------------------------------------------------------
  // Pattern Validators
  // -------------------------------------------------------------------------

  /** Match a regex pattern */
  matches(pattern: RegExp, options?: ValidationOptions): this {
    return this.addStrategy(new PatternStrategy(pattern, options));
  }

  /** Alias for matches */
  pattern(pattern: RegExp, options?: ValidationOptions): this {
    return this.matches(pattern, options);
  }

  /** Alias for matches */
  regex(pattern: RegExp, options?: ValidationOptions): this {
    return this.matches(pattern, options);
  }

  // -------------------------------------------------------------------------
  // Content Validators
  // -------------------------------------------------------------------------

  /** String must start with a prefix */
  startsWith(prefix: string, options?: ValidationOptions): this {
    return this.addStrategy(new StartsWithStrategy(prefix, options));
  }

  /** String must end with a suffix */
  endsWith(suffix: string, options?: ValidationOptions): this {
    return this.addStrategy(new EndsWithStrategy(suffix, options));
  }

  /** String must contain a substring */
  contains(substring: string, options?: ValidationOptions): this {
    return this.addStrategy(new ContainsStrategy(substring, options));
  }

  /** Alias for contains */
  includes(substring: string, options?: ValidationOptions): this {
    return this.contains(substring, options);
  }

  // -------------------------------------------------------------------------
  // Character Set Validators
  // -------------------------------------------------------------------------

  /** Must contain only letters (a-z, A-Z) */
  alpha(options?: ValidationOptions): this {
    return this.addStrategy(new AlphaStrategy(options));
  }

  /** Must contain only letters and numbers */
  alphanumeric(options?: ValidationOptions): this {
    return this.addStrategy(new AlphanumericStrategy(options));
  }

  /** Alias for alphanumeric */
  alphanum(options?: ValidationOptions): this {
    return this.alphanumeric(options);
  }

  /** Must contain only numeric characters */
  numeric(options?: ValidationOptions): this {
    return this.addStrategy(new NumericStrategy(options));
  }

  // -------------------------------------------------------------------------
  // Case Validators
  // -------------------------------------------------------------------------

  /** Must be all lowercase */
  lowercase(options?: ValidationOptions): this {
    return this.addStrategy(new LowercaseStrategy(options));
  }

  /** Must be all uppercase */
  uppercase(options?: ValidationOptions): this {
    return this.addStrategy(new UppercaseStrategy(options));
  }

  // -------------------------------------------------------------------------
  // Empty/Whitespace Validators
  // -------------------------------------------------------------------------

  /** Must not be empty or whitespace only */
  notEmpty(options?: ValidationOptions): this {
    return this.addStrategy(new NotEmptyStrategy(options));
  }

  /** Alias for notEmpty */
  nonempty(options?: ValidationOptions): this {
    return this.notEmpty(options);
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
