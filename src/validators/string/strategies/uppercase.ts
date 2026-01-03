/**
 * Uppercase Strategy
 * @module validators/string/strategies/uppercase
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/** Uppercase strategy */
export class UppercaseStrategy extends BaseValidationStrategy<string, string> {
  readonly name = 'uppercase';

  constructor(options?: ValidationOptions) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: string, context: ValidationContext): ValidationResult<string> {
    if (value !== value.toUpperCase()) {
      return this.failure('string.uppercase', context);
    }
    return this.success(value, context);
  }
}
