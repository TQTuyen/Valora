/**
 * Required Strategy
 * Ensures value is not null, undefined, or empty
 * @module validators/common/strategies/required
 */

import { BaseValidationStrategy } from '@core/index';
import { isNil } from '@utils/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/**
 * Required strategy - ensures value is not null, undefined, or empty
 */
export class RequiredStrategy<T> extends BaseValidationStrategy<T, T> {
  readonly name = 'required';

  validate(value: T, context: ValidationContext): ValidationResult<T> {
    if (isNil(value)) {
      return this.failure('common.required', context);
    }

    // For strings, also check for empty
    if (typeof value === 'string' && value.trim().length === 0) {
      return this.failure('string.required', context);
    }

    return this.success(value, context);
  }
}
