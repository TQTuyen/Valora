/**
 * Min Length Strategy
 * @module validators/string/strategies/min-length
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/** Minimum length strategy */
export class MinLengthStrategy extends BaseValidationStrategy<string, string> {
  readonly name = 'minLength';

  constructor(
    private readonly min: number,
    options?: ValidationOptions,
  ) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: string, context: ValidationContext): ValidationResult<string> {
    if (value.length < this.min) {
      return this.failure('string.minLength', context, {
        min: this.min,
        actual: value.length,
      });
    }
    return this.success(value, context);
  }
}
