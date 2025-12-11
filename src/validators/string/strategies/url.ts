/**
 * URL Strategy
 * @module validators/string/strategies/url
 */

import { BaseValidationStrategy } from '@core/index';
import { patterns } from '@utils/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/** URL validation strategy */
export class UrlStrategy extends BaseValidationStrategy<string, string> {
  readonly name = 'url';

  validate(value: string, context: ValidationContext): ValidationResult<string> {
    if (!patterns.url.test(value)) {
      return this.failure('string.url', context);
    }
    return this.success(value, context);
  }
}
