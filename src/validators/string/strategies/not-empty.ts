/**
 * Not Empty Strategy
 * @module validators/string/strategies/not-empty
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/** Not empty strategy (non-whitespace) */
export class NotEmptyStrategy extends BaseValidationStrategy<string, string> {
  readonly name = 'notEmpty';

  validate(value: string, context: ValidationContext): ValidationResult<string> {
    if (value.trim().length === 0) {
      return this.failure('string.notEmpty', context);
    }
    return this.success(value, context);
  }
}
