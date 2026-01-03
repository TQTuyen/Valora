/**
 * Pattern Strategy
 * @module validators/string/strategies/pattern
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/** Pattern matching strategy */
export class PatternStrategy extends BaseValidationStrategy<string, string> {
  readonly name = 'pattern';

  constructor(
    private readonly pattern: RegExp,
    options?: ValidationOptions,
  ) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: string, context: ValidationContext): ValidationResult<string> {
    if (!this.pattern.test(value)) {
      return this.failure('string.pattern', context);
    }
    return this.success(value, context);
  }
}
