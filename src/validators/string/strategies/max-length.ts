/**
 * Max Length Strategy
 * @module validators/string/strategies/max-length
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/** Maximum length strategy */
export class MaxLengthStrategy extends BaseValidationStrategy<string, string> {
  readonly name = 'maxLength';

  constructor(private readonly max: number) {
    super();
  }

  validate(value: string, context: ValidationContext): ValidationResult<string> {
    if (value.length > this.max) {
      return this.failure('string.maxLength', context, {
        max: this.max,
        actual: value.length,
      });
    }
    return this.success(value, context);
  }
}
