/**
 * Alphanumeric Strategy
 * @module validators/string/strategies/alphanumeric
 */

import { BaseValidationStrategy } from '@core/index';
import { patterns } from '@utils/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/** Alphanumeric strategy */
export class AlphanumericStrategy extends BaseValidationStrategy<string, string> {
  readonly name = 'alphanumeric';

  validate(value: string, context: ValidationContext): ValidationResult<string> {
    if (!patterns.alphanumeric.test(value)) {
      return this.failure('string.alphanumeric', context);
    }
    return this.success(value, context);
  }
}
