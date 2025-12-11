/**
 * Email Strategy
 * @module validators/string/strategies/email
 */

import { BaseValidationStrategy } from '@core/index';
import { patterns } from '@utils/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/** Email validation strategy */
export class EmailStrategy extends BaseValidationStrategy<string, string> {
  readonly name = 'email';

  validate(value: string, context: ValidationContext): ValidationResult<string> {
    if (!patterns.email.test(value)) {
      return this.failure('string.email', context);
    }
    return this.success(value, context);
  }
}
