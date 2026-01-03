/**
 * Numeric Strategy
 * @module validators/string/strategies/numeric
 */

import { BaseValidationStrategy } from '@core/index';
import { patterns } from '@utils/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/** Numeric strategy */
export class NumericStrategy extends BaseValidationStrategy<string, string> {
  readonly name = 'numeric';

  constructor(options?: ValidationOptions) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: string, context: ValidationContext): ValidationResult<string> {
    if (!patterns.numeric.test(value)) {
      return this.failure('string.numeric', context);
    }
    return this.success(value, context);
  }
}
