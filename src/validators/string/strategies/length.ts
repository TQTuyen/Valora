/**
 * Length Strategy
 * @module validators/string/strategies/length
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/** Exact length strategy */
export class LengthStrategy extends BaseValidationStrategy<string, string> {
  readonly name = 'length';

  constructor(private readonly exactLength: number) {
    super();
  }

  validate(value: string, context: ValidationContext): ValidationResult<string> {
    if (value.length !== this.exactLength) {
      return this.failure('string.length', context, {
        length: this.exactLength,
        actual: value.length,
      });
    }
    return this.success(value, context);
  }
}
