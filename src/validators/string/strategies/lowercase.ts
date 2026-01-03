/**
 * Lowercase Strategy
 * @module validators/string/strategies/lowercase
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/** Lowercase strategy */
export class LowercaseStrategy extends BaseValidationStrategy<string, string> {
  readonly name = 'lowercase';

  constructor(options?: ValidationOptions) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: string, context: ValidationContext): ValidationResult<string> {
    if (value !== value.toLowerCase()) {
      return this.failure('string.lowercase', context);
    }
    return this.success(value, context);
  }
}
