/**
 * Array Non-Empty Strategy
 * @module validators/array/strategies/non-empty
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/**
 * Non-empty strategy
 */
export class NonEmptyArrayStrategy<T> extends BaseValidationStrategy<T[], T[]> {
  readonly name = 'nonEmpty';

  constructor(options?: ValidationOptions) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: T[], context: ValidationContext): ValidationResult<T[]> {
    if (value.length === 0) {
      return this.failure('array.nonEmpty', context);
    }
    return this.success(value, context);
  }
}
