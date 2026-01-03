/**
 * Alpha Strategy
 * @module validators/string/strategies/alpha
 */

import { BaseValidationStrategy } from '@core/index';
import { patterns } from '@utils/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/** Alpha only strategy */
export class AlphaStrategy extends BaseValidationStrategy<string, string> {
  readonly name = 'alpha';

  constructor(options?: ValidationOptions) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: string, context: ValidationContext): ValidationResult<string> {
    if (!patterns.alpha.test(value)) {
      return this.failure('string.alpha', context);
    }
    return this.success(value, context);
  }
}
