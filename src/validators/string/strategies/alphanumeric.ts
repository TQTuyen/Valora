/**
 * Alphanumeric Strategy
 * @module validators/string/strategies/alphanumeric
 */

import { BaseValidationStrategy } from '@core/index';
import { patterns } from '@utils/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/** Alphanumeric strategy */
export class AlphanumericStrategy extends BaseValidationStrategy<string, string> {
  readonly name = 'alphanumeric';

  constructor(options?: ValidationOptions) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: string, context: ValidationContext): ValidationResult<string> {
    if (!patterns.alphanumeric.test(value)) {
      return this.failure('string.alphanumeric', context);
    }
    return this.success(value, context);
  }
}
