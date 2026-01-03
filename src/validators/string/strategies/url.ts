/**
 * URL Strategy
 * @module validators/string/strategies/url
 */

import { BaseValidationStrategy } from '@core/index';
import { patterns } from '@utils/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/** URL validation strategy */
export class UrlStrategy extends BaseValidationStrategy<string, string> {
  readonly name = 'url';

  constructor(options?: ValidationOptions) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: string, context: ValidationContext): ValidationResult<string> {
    if (!patterns.url.test(value)) {
      return this.failure('string.url', context);
    }
    return this.success(value, context);
  }
}
